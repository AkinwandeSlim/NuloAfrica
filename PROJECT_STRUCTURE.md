# 🏗️ NuloAfrica Project Structure

## Enterprise-Worthy Architecture

This project uses **Next.js Route Groups** for clean separation of concerns, making authentication, layouts, and middleware management much easier.

---

## 📁 Directory Structure

```
app/
├── (public)/                    # 🌐 Public-facing pages (no auth required)
│   ├── layout.tsx              # Public layout with navigation bar
│   ├── page.tsx                # Home page (/)
│   ├── landing/                # All pages showcase (/landing)
│   ├── properties/             # Property listings & details (/properties)
│   │   ├── page.tsx           # Listings page
│   │   └── [id]/page.tsx      # Property details
│   ├── signin/                 # Sign in page (/signin)
│   ├── signup/                 # Sign up page (/signup)
│   └── forgot-password/        # Password recovery (/forgot-password)
│
├── (dashboard)/                 # 🔒 Protected dashboard pages (auth required)
│   ├── layout.tsx              # Dashboard layout with sidebar
│   ├── dashboard/              # Main dashboard (/dashboard)
│   ├── favorites/              # Saved properties (/favorites)
│   ├── messages/               # User messages (/messages)
│   ├── profile/                # User profile (/profile)
│   └── admin/                  # Admin panel (/admin)
│
├── layout.tsx                   # Root layout (Google Maps, fonts, etc.)
├── globals.css                  # Global styles
└── loading.tsx                  # Loading state
```

---

## 🎯 Route Groups Explained

### What are Route Groups?
Route groups in Next.js use folder names wrapped in parentheses `(name)`. They:
- **Don't affect the URL structure** - `(public)/page.tsx` → `/` not `/public`
- **Allow different layouts** for different sections
- **Enable middleware targeting** specific route groups
- **Organize code logically** without impacting routes

### Benefits:
1. ✅ **Clean URLs** - No `/public` or `/dashboard` prefixes
2. ✅ **Shared Layouts** - Each group has its own layout
3. ✅ **Easy Authentication** - Protect entire groups with middleware
4. ✅ **Better Organization** - Clear separation of concerns
5. ✅ **Scalability** - Easy to add new pages to existing groups

---

## 🎨 Layout Differences

### Public Layout (`(public)/layout.tsx`)
**Features:**
- Fixed top navigation bar with glassmorphism
- Logo and navigation links (Home, Properties, All Pages)
- Auth buttons (Sign In, Get Started)
- Mobile responsive menu
- Warm ivory gradient background

**Used for:**
- Marketing pages
- Property browsing
- Authentication pages
- Public content

### Dashboard Layout (`(dashboard)/layout.tsx`)
**Features:**
- Fixed top bar with logo and user avatar
- Collapsible sidebar navigation
- Active link highlighting
- Notification bell
- Sign out button
- Mobile responsive with overlay

**Used for:**
- User dashboard
- Account management
- Saved favorites
- Messages
- Admin panel

---

## 🔐 Authentication Strategy

### Current Setup
Both layouts are currently **open** (no authentication required). This allows development and testing.

### Adding Authentication (Next Steps)

#### 1. Create Middleware
Create `middleware.ts` in the project root:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if user is authenticated
  const token = request.cookies.get('auth-token')
  const isAuthenticated = !!token

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/favorites') ||
      request.nextUrl.pathname.startsWith('/messages') ||
      request.nextUrl.pathname.startsWith('/profile') ||
      request.nextUrl.pathname.startsWith('/admin')) {
    
    if (!isAuthenticated) {
      // Redirect to signin with callback URL
      const signInUrl = new URL('/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && 
      (request.nextUrl.pathname === '/signin' || 
       request.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/favorites/:path*',
    '/messages/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/signin',
    '/signup',
  ],
}
```

#### 2. Authentication Provider Options

**Option A: NextAuth.js (Recommended)**
```bash
npm install next-auth
```

**Option B: Supabase Auth**
```bash
npm install @supabase/supabase-js
```

**Option C: Custom JWT Auth**
- Use cookies or localStorage
- Implement token refresh logic
- Add API routes for auth

#### 3. Update Layouts

Add auth context to dashboard layout:

```typescript
// In (dashboard)/layout.tsx
import { useAuth } from '@/lib/auth' // Your auth hook

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!user) redirect('/signin')

  return (
    // ... existing layout
  )
}
```

---

## 🚀 URL Structure

### Public Routes (No Auth)
| URL | File | Description |
|-----|------|-------------|
| `/` | `(public)/page.tsx` | Home page |
| `/landing` | `(public)/landing/page.tsx` | All pages showcase |
| `/properties` | `(public)/properties/page.tsx` | Property listings |
| `/properties/[id]` | `(public)/properties/[id]/page.tsx` | Property details |
| `/signin` | `(public)/signin/page.tsx` | Sign in |
| `/signup` | `(public)/signup/page.tsx` | Sign up |
| `/forgot-password` | `(public)/forgot-password/page.tsx` | Password recovery |

### Protected Routes (Auth Required)
| URL | File | Description |
|-----|------|-------------|
| `/dashboard` | `(dashboard)/dashboard/page.tsx` | User dashboard |
| `/favorites` | `(dashboard)/favorites/page.tsx` | Saved properties |
| `/messages` | `(dashboard)/messages/page.tsx` | User messages |
| `/profile` | `(dashboard)/profile/page.tsx` | User profile |
| `/admin` | `(dashboard)/admin/page.tsx` | Admin panel |

---

## 🎨 Design System

### Public Pages
- **Background**: Warm ivory gradient
- **Navigation**: Glassmorphism with backdrop blur
- **Colors**: Amber/gold accents (#f59e0b, #d4a857)
- **Style**: Minimalist African luxury

### Dashboard Pages
- **Background**: Slate/stone gradient
- **Sidebar**: White with active state highlighting
- **Colors**: Amber for active states
- **Style**: Clean, modern dashboard

---

## 📦 Adding New Pages

### Add Public Page
1. Create folder in `app/(public)/`
2. Add `page.tsx`
3. Automatically uses public layout
4. No authentication required

Example:
```bash
app/(public)/about/page.tsx → /about
```

### Add Dashboard Page
1. Create folder in `app/(dashboard)/`
2. Add `page.tsx`
3. Automatically uses dashboard layout
4. Add to middleware matcher for auth protection

Example:
```bash
app/(dashboard)/settings/page.tsx → /settings
```

---

## 🔧 Configuration Files

### Root Layout (`app/layout.tsx`)
- Google Maps API script
- Global fonts (Inter, Geist Mono)
- Analytics
- Metadata

### Global Styles (`app/globals.css`)
- Tailwind configuration
- Custom animations
- Glassmorphism utilities
- Color palette
- Luxury design classes

---

## 🎯 Best Practices

### 1. **Route Organization**
- ✅ Public pages → `(public)/`
- ✅ Protected pages → `(dashboard)/`
- ✅ API routes → `app/api/`
- ✅ Shared components → `components/`

### 2. **Layout Usage**
- ✅ Use route group layouts for shared UI
- ✅ Keep layouts client-side for interactivity
- ✅ Pass only necessary props to children

### 3. **Authentication**
- ✅ Implement middleware for route protection
- ✅ Use HTTP-only cookies for tokens
- ✅ Add loading states for auth checks
- ✅ Redirect with callback URLs

### 4. **Code Organization**
```
├── app/                    # Routes and pages
├── components/             # Reusable components
│   ├── ui/                # shadcn/ui components
│   ├── header.tsx         # Shared header
│   └── footer.tsx         # Shared footer
├── lib/                   # Utilities and helpers
│   ├── auth.ts           # Authentication logic
│   ├── utils.ts          # Helper functions
│   └── supabase.ts       # Database client
├── types/                 # TypeScript types
└── public/               # Static assets
```

---

## 🚦 Migration Benefits

### Before (Flat Structure)
```
app/
├── page.tsx
├── properties/page.tsx
├── dashboard/page.tsx
├── profile/page.tsx
└── ... (all mixed together)
```
**Problems:**
- ❌ Hard to apply different layouts
- ❌ Difficult to protect routes
- ❌ No clear separation
- ❌ Middleware complexity

### After (Route Groups)
```
app/
├── (public)/
│   └── ... (public pages)
└── (dashboard)/
    └── ... (protected pages)
```
**Benefits:**
- ✅ Clear separation of concerns
- ✅ Easy layout management
- ✅ Simple authentication
- ✅ Better scalability

---

## 📚 Resources

- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Next.js Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [NextAuth.js](https://next-auth.js.org/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

---

## 🎉 Summary

Your NuloAfrica project now has an **enterprise-worthy structure** with:

1. ✅ **Route Groups** for organization
2. ✅ **Separate Layouts** for public and dashboard
3. ✅ **Clean URLs** (no `/public` or `/dashboard` prefixes)
4. ✅ **Easy Authentication** setup (middleware ready)
5. ✅ **Scalable Architecture** for future growth
6. ✅ **Better Developer Experience** with clear separation

**Next Steps:**
1. Add authentication middleware
2. Implement auth provider (NextAuth/Supabase)
3. Add role-based access control (RBAC)
4. Connect to database
5. Deploy to production
