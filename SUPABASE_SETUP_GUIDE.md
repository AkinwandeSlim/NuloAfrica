# 🔐 Supabase Authentication Setup Guide

## Complete guide for setting up Supabase authentication in NuloAfrica

---

## 📋 Prerequisites

1. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
2. **Node.js 18+** installed
3. **npm or yarn** package manager

---

## 🚀 Step 1: Create Supabase Project

### 1.1 Create New Project
1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name:** NuloAfrica
   - **Database Password:** (save this securely!)
   - **Region:** Choose closest to your users (e.g., Africa - South Africa)
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

### 1.2 Get Your API Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

---

## 🔧 Step 2: Environment Variables

### 2.1 Create `.env.local` file

Create a file named `.env.local` in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Google Maps API (already configured)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_existing_key
```

### 2.2 Replace with Your Values

```bash
# Example:
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Important:** Never commit `.env.local` to Git! It's already in `.gitignore`.

---

## 📦 Step 3: Install Dependencies

Run these commands in your terminal:

```bash
# Install Supabase client
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Install Redux Toolkit for state management
npm install @reduxjs/toolkit react-redux

# Install additional utilities
npm install jose
```

Or with yarn:

```bash
yarn add @supabase/supabase-js @supabase/auth-helpers-nextjs
yarn add @reduxjs/toolkit react-redux
yarn add jose
```

---

## 🗄️ Step 4: Database Schema

### 4.1 Create Tables in Supabase

Go to **SQL Editor** in Supabase dashboard and run this:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'tenant' CHECK (role IN ('tenant', 'landlord', 'admin')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Properties Table
CREATE TABLE properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  landlord_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price DECIMAL(10, 2) NOT NULL,
  price_per_month DECIMAL(10, 2),
  beds INTEGER,
  baths INTEGER,
  sqft INTEGER,
  property_type TEXT CHECK (property_type IN ('apartment', 'house', 'villa', 'penthouse', 'studio', 'loft')),
  status TEXT DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'maintenance')),
  featured BOOLEAN DEFAULT FALSE,
  images TEXT[], -- Array of image URLs
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Favorites Table
CREATE TABLE favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, property_id)
);

-- Messages Table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Rentals Table
CREATE TABLE rentals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  landlord_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  monthly_rent DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Maintenance Requests Table
CREATE TABLE maintenance_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Payments Table
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  rental_id UUID REFERENCES rentals(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_properties_landlord ON properties(landlord_id);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_rentals_tenant ON rentals(tenant_id);
CREATE INDEX idx_rentals_landlord ON rentals(landlord_id);
CREATE INDEX idx_maintenance_tenant ON maintenance_requests(tenant_id);
CREATE INDEX idx_payments_rental ON payments(rental_id);
```

### 4.2 Enable Row Level Security (RLS)

Run this to secure your data:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Properties: Everyone can view, only landlords can create/update their own
CREATE POLICY "Properties are viewable by everyone"
  ON properties FOR SELECT
  USING (true);

CREATE POLICY "Landlords can create properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete own properties"
  ON properties FOR DELETE
  USING (auth.uid() = landlord_id);

-- Favorites: Users can manage their own favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Messages: Users can view their own messages
CREATE POLICY "Users can view sent messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Rentals: Tenants and landlords can view their rentals
CREATE POLICY "Users can view own rentals"
  ON rentals FOR SELECT
  USING (auth.uid() = tenant_id OR auth.uid() = landlord_id);

-- Maintenance: Tenants can create, landlords can view/update
CREATE POLICY "Tenants can view own requests"
  ON maintenance_requests FOR SELECT
  USING (auth.uid() = tenant_id);

CREATE POLICY "Tenants can create requests"
  ON maintenance_requests FOR INSERT
  WITH CHECK (auth.uid() = tenant_id);

-- Payments: Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (
    auth.uid() IN (
      SELECT tenant_id FROM rentals WHERE id = rental_id
      UNION
      SELECT landlord_id FROM rentals WHERE id = rental_id
    )
  );
```

### 4.3 Create Database Functions

```sql
-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rentals_updated_at BEFORE UPDATE ON rentals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔑 Step 5: Configure Authentication

### 5.1 Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)

### 5.2 Configure Email Templates (Optional)

Go to **Authentication** → **Email Templates** and customize:
- **Confirm signup**
- **Magic Link**
- **Change Email Address**
- **Reset Password**

### 5.3 Set Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL:** `http://localhost:3000` (development)
3. Add **Redirect URLs:**
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/signin`
   - `http://localhost:3000/signup`

For production, add your production URLs.

---

## 🎨 Step 6: Optional - Enable Social Auth

### Google OAuth (Optional)

1. Go to **Authentication** → **Providers**
2. Enable **Google**
3. Add Google OAuth credentials:
   - Get from [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`

---

## ✅ Step 7: Verify Setup

### 7.1 Test Connection

Run your dev server:

```bash
npm run dev
```

### 7.2 Check Supabase Connection

Open browser console and check for errors. The Supabase client should initialize without issues.

### 7.3 Test Sign Up

1. Go to `/signup`
2. Create a test account
3. Check **Authentication** → **Users** in Supabase dashboard
4. Check **Table Editor** → **profiles** for new profile

---

## 📚 Next Steps

After completing this setup:

1. ✅ **Authentication is configured**
2. ✅ **Database schema is created**
3. ✅ **RLS policies are in place**
4. ⏭️ **Implement auth hooks and utilities** (next step)
5. ⏭️ **Add middleware for route protection**
6. ⏭️ **Setup Redux for state management**

---

## 🐛 Troubleshooting

### Issue: "Invalid API key"
- Check `.env.local` file exists
- Verify keys are correct (no extra spaces)
- Restart dev server after adding env vars

### Issue: "Failed to fetch"
- Check Supabase project is running
- Verify Project URL is correct
- Check internet connection

### Issue: "Row Level Security policy violation"
- Verify RLS policies are created
- Check user is authenticated
- Review policy conditions

### Issue: Profile not created on signup
- Check trigger function exists
- Verify function has correct permissions
- Check Supabase logs for errors

---

## 📖 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎉 Congratulations!

Your Supabase backend is now fully configured and ready for authentication!

**Next:** I'll create the authentication utilities, hooks, and middleware to connect your frontend to Supabase.

---

*Last Updated: 2025-10-11*
*Version: 1.0*
*Status: ✅ Ready for Implementation*
