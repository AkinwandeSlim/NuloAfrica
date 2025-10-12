# 🏛️ NuloAfrica Architecture

## Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     Root Layout (app/layout.tsx)            │
│  • Google Maps API                                          │
│  • Global Fonts (Inter, Geist Mono)                        │
│  • Analytics                                                 │
│  • Metadata                                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├─────────────────────┬──────────────────────
                            │                     │
                            ▼                     ▼
        ┌──────────────────────────────┐  ┌──────────────────────────────┐
        │   PUBLIC LAYOUT              │  │   DASHBOARD LAYOUT           │
        │   (public)/layout.tsx        │  │   (dashboard)/layout.tsx     │
        │                              │  │                              │
        │  ┌────────────────────────┐  │  │  ┌────────────────────────┐  │
        │  │  Fixed Navigation      │  │  │  │  Top Bar + Sidebar     │  │
        │  │  • Logo                │  │  │  │  • User Avatar         │  │
        │  │  • Nav Links           │  │  │  │  • Notifications       │  │
        │  │  • Auth Buttons        │  │  │  │  • Active Links        │  │
        │  │  • Mobile Menu         │  │  │  │  • Sign Out            │  │
        │  └────────────────────────┘  │  │  └────────────────────────┘  │
        │                              │  │                              │
        │  Background:                 │  │  Background:                 │
        │  Warm Ivory Gradient         │  │  Slate/Stone Gradient        │
        └──────────────────────────────┘  └──────────────────────────────┘
                    │                                 │
                    │                                 │
        ┌───────────┴───────────┐         ┌──────────┴──────────┐
        │                       │         │                     │
        ▼                       ▼         ▼                     ▼
┌─────────────┐      ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│    Home     │      │ Properties  │  │  Dashboard  │  │  Favorites  │
│     /       │      │/properties  │  │ /dashboard  │  │ /favorites  │
└─────────────┘      └─────────────┘  └─────────────┘  └─────────────┘
        │                    │              │                  │
        ▼                    ▼              ▼                  ▼
┌─────────────┐      ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Landing   │      │  Property   │  │  Messages   │  │   Profile   │
│  /landing   │      │   Details   │  │  /messages  │  │  /profile   │
└─────────────┘      │/properties/ │  └─────────────┘  └─────────────┘
        │            │    [id]     │          │              │
        ▼            └─────────────┘          ▼              ▼
┌─────────────┐              │          ┌─────────────┐  ┌─────────────┐
│   Sign In   │              │          │    Admin    │  │  Settings   │
│   /signin   │              │          │   /admin    │  │  (future)   │
└─────────────┘              │          └─────────────┘  └─────────────┘
        │                    │
        ▼                    │
┌─────────────┐              │
│   Sign Up   │              │
│   /signup   │              │
└─────────────┘              │
        │                    │
        ▼                    │
┌─────────────┐              │
│   Forgot    │              │
│  Password   │              │
└─────────────┘              │
                             │
                             ▼
                    🔒 MIDDLEWARE
                    • Auth Check
                    • Route Protection
                    • Redirects
```

---

## Request Flow

### Public Page Request (e.g., `/properties`)

```
1. User visits /properties
   │
   ├─→ 2. Next.js Router
   │      │
   │      ├─→ 3. Root Layout (app/layout.tsx)
   │      │      • Loads Google Maps
   │      │      • Sets up fonts
   │      │
   │      ├─→ 4. Public Layout (app/(public)/layout.tsx)
   │      │      • Renders navigation bar
   │      │      • Applies warm ivory background
   │      │
   │      └─→ 5. Page Component (app/(public)/properties/page.tsx)
   │             • Renders property listings
   │             • Fetches data
   │
   └─→ 6. Response sent to browser
```

### Dashboard Page Request (e.g., `/dashboard`)

```
1. User visits /dashboard
   │
   ├─→ 2. Middleware (middleware.ts)
   │      • Checks authentication
   │      • If not authenticated → redirect to /signin
   │      • If authenticated → continue
   │
   ├─→ 3. Next.js Router
   │      │
   │      ├─→ 4. Root Layout (app/layout.tsx)
   │      │      • Loads Google Maps
   │      │      • Sets up fonts
   │      │
   │      ├─→ 5. Dashboard Layout (app/(dashboard)/layout.tsx)
   │      │      • Renders sidebar
   │      │      • Shows user avatar
   │      │      • Highlights active link
   │      │
   │      └─→ 6. Page Component (app/(dashboard)/dashboard/page.tsx)
   │             • Renders dashboard content
   │             • Fetches user data
   │
   └─→ 7. Response sent to browser
```

---

## Authentication Flow

### Sign In Process

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     ├─→ 1. Visit /signin
     │      (Public page - no auth required)
     │
     ├─→ 2. Enter credentials
     │      • Email
     │      • Password
     │
     ├─→ 3. Submit form
     │      │
     │      ├─→ API call to /api/auth/signin
     │      │      • Validate credentials
     │      │      • Generate token
     │      │
     │      └─→ Set auth cookie
     │             • HttpOnly
     │             • Secure
     │             • SameSite
     │
     ├─→ 4. Redirect to /dashboard
     │      (or callbackUrl if provided)
     │
     └─→ 5. Middleware checks auth
            • Cookie present ✓
            • Allow access to dashboard
```

### Protected Route Access

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     ├─→ 1. Try to visit /dashboard
     │
     ├─→ 2. Middleware intercepts
     │      │
     │      ├─→ Check for auth cookie
     │      │
     │      ├─→ If NO cookie:
     │      │      • Redirect to /signin?callbackUrl=/dashboard
     │      │
     │      └─→ If HAS cookie:
     │             • Verify token
     │             • Allow access
     │
     └─→ 3. Dashboard page loads
```

---

## Data Flow

### Property Listing Page

```
┌─────────────────────────────────────────────────┐
│  User visits /properties                        │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  Page Component Loads                           │
│  • useState for filters                         │
│  • useState for properties                      │
│  • useState for view mode (list/map)           │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  useEffect runs                                 │
│  • Fetch properties from API/Database          │
│  • Apply filters (location, price, type)       │
│  • Calculate distances (if location enabled)   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  Render UI                                      │
│  • If list view: Property cards                │
│  • If map view: Google Map with markers        │
│  • Filters sidebar                             │
│  • Sort dropdown                               │
└─────────────────────────────────────────────────┘
```

---

## Component Hierarchy

### Public Pages

```
Root Layout
└── Public Layout
    ├── Navigation Bar
    │   ├── Logo
    │   ├── Nav Links
    │   │   ├── Home
    │   │   ├── Properties
    │   │   ├── Landing
    │   │   └── Dashboard
    │   ├── Auth Buttons
    │   │   ├── Sign In
    │   │   └── Get Started
    │   └── Mobile Menu
    │       └── (Same as above)
    │
    └── Page Content
        ├── Home Page
        │   ├── Hero Section
        │   ├── Search Bar (Google Autocomplete)
        │   ├── Featured Properties
        │   └── CTA Section
        │
        ├── Properties Page
        │   ├── Filters
        │   ├── View Toggle (List/Map)
        │   ├── Property Cards
        │   └── Map View
        │
        └── Property Details
            ├── Image Carousel
            ├── Property Info
            ├── Amenities
            ├── Location Map
            └── Contact Form
```

### Dashboard Pages

```
Root Layout
└── Dashboard Layout
    ├── Top Bar
    │   ├── Logo
    │   ├── Mobile Menu Toggle
    │   ├── Notifications
    │   └── User Avatar
    │
    ├── Sidebar
    │   ├── Navigation Links
    │   │   ├── Dashboard (active state)
    │   │   ├── Favorites
    │   │   ├── Messages
    │   │   ├── Profile
    │   │   └── Admin
    │   └── Bottom Actions
    │       ├── Browse Properties
    │       └── Sign Out
    │
    └── Page Content
        ├── Dashboard
        │   ├── Stats Cards
        │   ├── Recent Activity
        │   └── Quick Actions
        │
        ├── Favorites
        │   └── Property Grid
        │
        ├── Messages
        │   ├── Conversation List
        │   └── Chat Interface
        │
        └── Profile
            ├── Avatar Upload
            ├── Personal Info Form
            ├── Notification Settings
            └── Security Actions
```

---

## State Management

### Current Approach (Component State)

```typescript
// Each page manages its own state
const [data, setData] = useState([])
const [loading, setLoading] = useState(true)
const [filters, setFilters] = useState({})
```

### Future: Global State (Recommended for Scale)

```typescript
// Option 1: React Context
<AuthProvider>
  <UserProvider>
    <App />
  </UserProvider>
</AuthProvider>

// Option 2: Zustand
import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))

// Option 3: Redux Toolkit
import { configureStore } from '@reduxjs/toolkit'
```

---

## API Routes Structure (Future)

```
app/api/
├── auth/
│   ├── signin/route.ts
│   ├── signup/route.ts
│   ├── signout/route.ts
│   └── refresh/route.ts
│
├── properties/
│   ├── route.ts              # GET /api/properties (list)
│   ├── [id]/route.ts         # GET /api/properties/[id]
│   └── search/route.ts       # POST /api/properties/search
│
├── favorites/
│   ├── route.ts              # GET /api/favorites
│   └── [id]/route.ts         # POST/DELETE /api/favorites/[id]
│
├── messages/
│   ├── route.ts              # GET /api/messages
│   └── [id]/route.ts         # GET/POST /api/messages/[id]
│
└── user/
    ├── profile/route.ts      # GET/PUT /api/user/profile
    └── settings/route.ts     # GET/PUT /api/user/settings
```

---

## Security Layers

```
┌─────────────────────────────────────────┐
│  1. Middleware (Route Protection)       │
│     • Checks authentication             │
│     • Redirects unauthorized users      │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  2. API Route Protection                │
│     • Validates JWT tokens              │
│     • Checks user permissions           │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  3. Database Row-Level Security (RLS)   │
│     • Supabase policies                 │
│     • User can only access own data     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  4. Input Validation                    │
│     • Zod schemas                       │
│     • Sanitize user input               │
└─────────────────────────────────────────┘
```

---

## Performance Optimizations

### Current
- ✅ Route groups for code splitting
- ✅ Next.js automatic code splitting
- ✅ Image optimization (Next.js Image)
- ✅ CSS optimization (Tailwind purge)

### Recommended Additions
- 🔄 React Server Components (RSC)
- 🔄 Incremental Static Regeneration (ISR)
- 🔄 Edge runtime for API routes
- 🔄 CDN for static assets
- 🔄 Database connection pooling
- 🔄 Redis caching layer

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│              Vercel / Netlify                   │
│  ┌───────────────────────────────────────────┐  │
│  │  Next.js App (Edge Network)               │  │
│  │  • Static pages cached globally           │  │
│  │  • Dynamic pages rendered on-demand       │  │
│  │  • API routes as serverless functions     │  │
│  └───────────────┬───────────────────────────┘  │
└──────────────────┼──────────────────────────────┘
                   │
                   ├─→ Supabase (Database)
                   │   • PostgreSQL
                   │   • Row-level security
                   │   • Real-time subscriptions
                   │
                   ├─→ Google Maps API
                   │   • Autocomplete
                   │   • Maps rendering
                   │   • Directions
                   │
                   └─→ Cloud Storage (Images)
                       • Cloudinary / S3
                       • Image optimization
                       • CDN delivery
```

---

## Summary

Your NuloAfrica project now has:

1. ✅ **Clean Architecture** - Route groups for organization
2. ✅ **Separate Layouts** - Public vs Dashboard
3. ✅ **Scalable Structure** - Easy to add new features
4. ✅ **Security Ready** - Middleware for auth protection
5. ✅ **Performance Optimized** - Code splitting by default
6. ✅ **Developer Friendly** - Clear separation of concerns

**This is an enterprise-worthy architecture! 🎉**
