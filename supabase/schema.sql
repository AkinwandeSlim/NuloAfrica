-- NULO AFRICA - COMPLETE DATABASE SCHEMA
-- Run this entire file in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- For encryption
CREATE EXTENSION IF NOT EXISTS "cube"; -- For geospatial
CREATE EXTENSION IF NOT EXISTS "earthdistance"; -- For distance calculations

-- ============================================================================
-- 1. USERS TABLE (Base Authentication Table)
-- ============================================================================

CREATE TABLE users (
  -- Primary identifiers
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT UNIQUE,
  
  -- Authentication (handled by Supabase Auth, but we track here too)
  password_hash TEXT,
  
  -- Profile
  full_name TEXT,
  avatar_url TEXT,
  
  -- Trust & Verification (NULO UNIQUE)
  trust_score INTEGER DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  verification_status TEXT DEFAULT 'partial' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'partial')),
  
  -- User type (polymorphic discriminator)
  user_type TEXT NOT NULL CHECK (user_type IN ('landlord', 'tenant', 'admin')),
  
  -- Metadata
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- Soft delete
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_phone ON users(phone_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_users_trust_score ON users(trust_score);
CREATE INDEX idx_users_verification ON users(verification_status);

-- Full-text search on name and email
CREATE INDEX idx_users_search ON users USING gin(to_tsvector('english', COALESCE(full_name, '') || ' ' || email));

-- ============================================================================
-- 2. TENANTS TABLE (Tenant-Specific Data)
-- ============================================================================

CREATE TABLE tenants (
  -- One-to-one with users
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  -- Preferences (nullable for deferred KYC)
  budget DECIMAL(12,2),
  preferred_location TEXT,
  move_in_date DATE,
  
  -- Search preferences (JSONB for flexibility)
  preferences JSONB DEFAULT '{}'::jsonb,
  
  -- Documents (JSONB with URLs from Supabase Storage)
  documents JSONB DEFAULT '{}'::jsonb,
  
  -- Profile completion tracking (NULO UNIQUE: Deferred KYC)
  profile_completion INTEGER DEFAULT 0 CHECK (profile_completion >= 0 AND profile_completion <= 100),
  
  -- Onboarding tracking
  onboarding_completed BOOLEAN DEFAULT false,
  profile_completed_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tenants_budget ON tenants(budget) WHERE budget IS NOT NULL;
CREATE INDEX idx_tenants_location ON tenants(preferred_location) WHERE preferred_location IS NOT NULL;
CREATE INDEX idx_tenants_completion ON tenants(profile_completion);

-- ============================================================================
-- 3. LANDLORDS TABLE (Landlord-Specific Data)
-- ============================================================================

CREATE TABLE landlords (
  -- One-to-one with users
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  -- Verification documents
  ownership_docs TEXT[] DEFAULT '{}',
  
  -- Verification metadata
  verification_submitted_at TIMESTAMPTZ,
  verification_approved_at TIMESTAMPTZ,
  verification_notes TEXT,
  
  -- NULO UNIQUE: Rent Guarantee Fund
  guarantee_joined BOOLEAN DEFAULT false,
  guarantee_joined_at TIMESTAMPTZ,
  guarantee_contribution DECIMAL(12,2) DEFAULT 0,
  
  -- Banking info
  bank_account_number TEXT,
  bank_name TEXT,
  account_name TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_landlords_guarantee ON landlords(guarantee_joined);
CREATE INDEX idx_landlords_verification ON landlords(verification_approved_at);

-- ============================================================================
-- 4. ADMINS TABLE (Admin-Specific Data)
-- ============================================================================

CREATE TABLE admins (
  -- One-to-one with users
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  -- Permissions
  role_level INTEGER DEFAULT 1 CHECK (role_level >= 1 AND role_level <= 5),
  permissions JSONB DEFAULT '{}'::jsonb,
  
  -- Activity tracking
  last_action_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_admins_role ON admins(role_level);

-- ============================================================================
-- 5. PROPERTIES TABLE (Property Listings)
-- ============================================================================

CREATE TABLE properties (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Ownership
  landlord_id UUID NOT NULL REFERENCES landlords(id) ON DELETE CASCADE,
  
  -- Basic info
  title TEXT NOT NULL,
  description TEXT,
  
  -- Pricing
  rent_amount DECIMAL(12,2) NOT NULL,
  security_deposit DECIMAL(12,2),
  agency_fee DECIMAL(12,2) DEFAULT 0,
  
  -- Location
  location TEXT NOT NULL,
  address TEXT,
  city TEXT DEFAULT 'Lagos',
  state TEXT DEFAULT 'Lagos',
  country TEXT DEFAULT 'Nigeria',
  
  -- Coordinates
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Property details
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER DEFAULT 1,
  square_feet INTEGER,
  property_type TEXT DEFAULT 'apartment' CHECK (property_type IN ('apartment', 'house', 'duplex', 'studio', 'penthouse')),
  
  -- Amenities
  amenities TEXT[] DEFAULT '{}',
  
  -- Photos
  photos TEXT[] DEFAULT '{}',
  
  -- Availability
  availability_start DATE,
  availability_end DATE,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'rented', 'inactive')),
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  application_count INTEGER DEFAULT 0,
  
  -- SEO & Search
  slug TEXT UNIQUE,
  
  -- Verification
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES admins(id),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes (CRITICAL for performance)
CREATE INDEX idx_properties_landlord ON properties(landlord_id);
CREATE INDEX idx_properties_status ON properties(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_location ON properties(location) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_rent ON properties(rent_amount) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_created ON properties(created_at DESC) WHERE deleted_at IS NULL;

-- Full-text search index
CREATE INDEX idx_properties_search ON properties 
USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || location));

-- Geospatial index
CREATE INDEX idx_properties_location_geo ON properties USING gist(
  ll_to_earth(latitude, longitude)
) WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND deleted_at IS NULL;

-- ============================================================================
-- 6. APPLICATIONS TABLE (Tenant Applications)
-- ============================================================================

CREATE TABLE applications (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relationships
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Application details
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'withdrawn')),
  
  -- Documents submitted
  documents JSONB DEFAULT '{}'::jsonb,
  
  -- Personal message
  message TEXT,
  
  -- Proposed move-in date
  proposed_move_in_date DATE,
  
  -- Rejection
  rejection_reason TEXT,
  reason_code TEXT,
  
  -- Review tracking
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES landlords(id),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint
  CONSTRAINT unique_active_application UNIQUE(tenant_id, property_id)
);

-- Indexes
CREATE INDEX idx_applications_tenant ON applications(tenant_id);
CREATE INDEX idx_applications_property ON applications(property_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created ON applications(created_at DESC);
CREATE INDEX idx_applications_landlord_status ON applications(property_id, status, created_at DESC);

-- ============================================================================
-- 7. MESSAGES TABLE (In-App Chat)
-- ============================================================================

CREATE TABLE messages (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relationships
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Optional context
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  
  -- Message content
  content TEXT NOT NULL,
  
  -- Attachments
  attachments TEXT[] DEFAULT '{}',
  
  -- Message metadata
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Message type
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'document', 'system')),
  
  -- Timestamps
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- Soft delete
  deleted_by_sender BOOLEAN DEFAULT false,
  deleted_by_recipient BOOLEAN DEFAULT false
);

-- Indexes (CRITICAL for chat performance)
CREATE INDEX idx_messages_sender ON messages(sender_id, timestamp DESC);
CREATE INDEX idx_messages_recipient ON messages(recipient_id, timestamp DESC);
CREATE INDEX idx_messages_conversation ON messages(sender_id, recipient_id, timestamp DESC);
CREATE INDEX idx_messages_unread ON messages(recipient_id, read) WHERE read = false;
CREATE INDEX idx_messages_between_users ON messages(
  LEAST(sender_id, recipient_id),
  GREATEST(sender_id, recipient_id),
  timestamp DESC
);

-- Enable Realtime
ALTER TABLE messages REPLICA IDENTITY FULL;

-- ============================================================================
-- 8. TRANSACTIONS TABLE (Payment Tracking)
-- ============================================================================

CREATE TABLE transactions (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relationships
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  landlord_id UUID NOT NULL REFERENCES landlords(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  
  -- Payment details
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  
  -- Payment status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'held', 'released', 'refunded', 'failed')),
  
  -- Payment gateway
  payment_gateway TEXT DEFAULT 'paystack',
  paystack_ref TEXT UNIQUE,
  paystack_access_code TEXT,
  
  -- Escrow tracking
  held_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  
  -- Transaction metadata
  transaction_type TEXT DEFAULT 'rent_payment' CHECK (transaction_type IN ('rent_payment', 'security_deposit', 'guarantee_contribution')),
  
  -- Notes
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_transactions_application ON transactions(application_id);
CREATE INDEX idx_transactions_tenant ON transactions(tenant_id);
CREATE INDEX idx_transactions_landlord ON transactions(landlord_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_paystack ON transactions(paystack_ref) WHERE paystack_ref IS NOT NULL;

-- ============================================================================
-- 9. RATINGS TABLE (User Reviews)
-- ============================================================================

CREATE TABLE ratings (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relationships
  rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rated_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Optional links
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  
  -- Rating
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  
  -- Review
  comment TEXT,
  
  -- Rating categories
  communication_score INTEGER CHECK (communication_score >= 1 AND communication_score <= 5),
  reliability_score INTEGER CHECK (reliability_score >= 1 AND reliability_score <= 5),
  cleanliness_score INTEGER CHECK (cleanliness_score >= 1 AND cleanliness_score <= 5),
  
  -- Moderation
  flagged BOOLEAN DEFAULT false,
  moderated_by UUID REFERENCES admins(id),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint
  CONSTRAINT unique_rating_per_application UNIQUE(rater_id, rated_id, application_id)
);

-- Indexes
CREATE INDEX idx_ratings_rater ON ratings(rater_id);
CREATE INDEX idx_ratings_rated ON ratings(rated_id);
CREATE INDEX idx_ratings_score ON ratings(score);
CREATE INDEX idx_ratings_created ON ratings(created_at DESC);

-- ============================================================================
-- 10. GUARANTEE_FUND TABLE (NULO UNIQUE)
-- ============================================================================

CREATE TABLE guarantee_fund (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relationships
  landlord_id UUID NOT NULL REFERENCES landlords(id) ON DELETE CASCADE,
  
  -- Contribution
  amount DECIMAL(12,2) NOT NULL,
  contribution_type TEXT DEFAULT 'monthly' CHECK (contribution_type IN ('initial', 'monthly', 'one_time')),
  
  -- Pool tracking
  pool_total DECIMAL(12,2),
  
  -- Transaction
  transaction_id UUID REFERENCES transactions(id),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_guarantee_fund_landlord ON guarantee_fund(landlord_id);
CREATE INDEX idx_guarantee_fund_created ON guarantee_fund(created_at DESC);

-- View for current pool total
CREATE OR REPLACE VIEW guarantee_fund_summary AS
SELECT 
  COUNT(DISTINCT landlord_id) as total_landlords,
  SUM(amount) as total_pool,
  AVG(amount) as avg_contribution,
  MAX(created_at) as last_contribution
FROM guarantee_fund;

-- ============================================================================
-- 11. FAVORITES TABLE (Saved Properties)
-- ============================================================================

CREATE TABLE favorites (
  -- Composite primary key
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (tenant_id, property_id)
);

-- Indexes
CREATE INDEX idx_favorites_tenant ON favorites(tenant_id, created_at DESC);
CREATE INDEX idx_favorites_property ON favorites(property_id);

-- ============================================================================
-- 12. NOTIFICATIONS TABLE (System Notifications)
-- ============================================================================

CREATE TABLE notifications (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Recipient
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'application_submitted',
    'application_approved',
    'application_rejected',
    'new_message',
    'property_verified',
    'payment_received',
    'profile_incomplete',
    'system_announcement'
  )),
  
  -- Related entities
  related_id UUID,
  related_type TEXT,
  
  -- Action URL
  action_url TEXT,
  
  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read) WHERE read = false;
CREATE INDEX idx_notifications_type ON notifications(notification_type);

-- Enable Realtime
ALTER TABLE notifications REPLICA IDENTITY FULL;

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_landlords_updated_at BEFORE UPDATE ON landlords
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate property slug
CREATE OR REPLACE FUNCTION generate_property_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER property_slug_trigger BEFORE INSERT ON properties
FOR EACH ROW EXECUTE FUNCTION generate_property_slug();

-- Auto-update property application count
CREATE OR REPLACE FUNCTION update_property_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE properties SET application_count = application_count + 1 WHERE id = NEW.property_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE properties SET application_count = application_count - 1 WHERE id = OLD.property_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER application_count_trigger AFTER INSERT OR DELETE ON applications
FOR EACH ROW EXECUTE FUNCTION update_property_application_count();

-- Auto-update property favorite count
CREATE OR REPLACE FUNCTION update_property_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE properties SET favorite_count = favorite_count + 1 WHERE id = NEW.property_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE properties SET favorite_count = favorite_count - 1 WHERE id = OLD.property_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER favorite_count_trigger AFTER INSERT OR DELETE ON favorites
FOR EACH ROW EXECUTE FUNCTION update_property_favorite_count();

-- Auto-update trust score from rating
CREATE OR REPLACE FUNCTION update_trust_score_from_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET trust_score = LEAST(100, GREATEST(0, 
    50 + -- Base score
    (SELECT COALESCE(AVG(score) - 3, 0) * 10 FROM ratings WHERE rated_id = NEW.rated_id) + -- Rating impact
    CASE WHEN verification_status = 'approved' THEN 20 ELSE 0 END -- Verification bonus
  ))
  WHERE id = NEW.rated_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rating_trust_score_trigger AFTER INSERT ON ratings
FOR EACH ROW EXECUTE FUNCTION update_trust_score_from_rating();

-- ============================================================================
-- COMPLETED: Nulo Africa Database Schema
-- ============================================================================
