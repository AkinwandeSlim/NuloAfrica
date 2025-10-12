# 🔐 Authentication Implementation Guide

## Complete step-by-step guide to integrate authentication into your app

---

## ✅ What's Been Created

### 1. **Supabase Client** (`lib/supabase/client.ts`)
- Client-side Supabase instance
- Admin client for server-side operations
- TypeScript types for database tables

### 2. **Authentication Hook** (`hooks/useAuth.ts`)
- `signUp()` - Register new users
- `signIn()` - Login users
- `signOut()` - Logout users
- `resetPassword()` - Password recovery
- `updatePassword()` - Change password
- `updateProfile()` - Update user profile
- Auto-fetches user profile on login

### 3. **Middleware** (`middleware.ts`)
- Protects routes based on authentication
- Role-based access control (RBAC)
- Redirects unauthenticated users to signin
- Redirects authenticated users away from auth pages
- Routes users to appropriate dashboards based on role

### 4. **Redux Store** (`store/`)
- **authSlice** - User, profile, session state
- **propertiesSlice** - Properties management
- **favoritesSlice** - Favorites management
- **messagesSlice** - Messages and conversations
- Type-safe hooks (`useAppDispatch`, `useAppSelector`)

### 5. **Providers** (`components/providers/`)
- **ReduxProvider** - Redux store provider
- **AuthProvider** - Authentication context + Redux sync

### 6. **Unauthorized Page** (`app/unauthorized/page.tsx`)
- Shown when user tries to access restricted routes

---

## 🚀 Step-by-Step Integration

### Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @reduxjs/toolkit react-redux jose
```

### Step 2: Setup Environment Variables

Create `.env.local` in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_existing_google_maps_key
```

### Step 3: Setup Supabase Database

Follow the **SUPABASE_SETUP_GUIDE.md** to:
1. Create Supabase project
2. Run SQL schema
3. Enable RLS policies
4. Create database functions

### Step 4: Wrap Your App with Providers

Update `app/layout.tsx`:

```tsx
import { ReduxProvider } from '@/components/providers/ReduxProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
```

### Step 5: Update Sign In Page

Update `app/(public)/signin/page.tsx`:

```tsx
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await signIn(email, password)

    if (error) {
      setError(error)
      setLoading(false)
    } else if (data) {
      // Middleware will redirect to appropriate dashboard
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold">Sign In</h1>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <p className="text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-amber-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  )
}
```

### Step 6: Update Sign Up Page

Update `app/(public)/signup/page.tsx`:

```tsx
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'tenant' | 'landlord'>('tenant')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await signUp(email, password, fullName, role)

    if (error) {
      setError(error)
      setLoading(false)
    } else {
      // Show success message
      alert('Check your email to confirm your account!')
      router.push('/signin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <Input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium">I am a:</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="tenant"
                checked={role === 'tenant'}
                onChange={(e) => setRole(e.target.value as 'tenant')}
                className="mr-2"
              />
              Tenant
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="landlord"
                checked={role === 'landlord'}
                onChange={(e) => setRole(e.target.value as 'landlord')}
                className="mr-2"
              />
              Landlord
            </label>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>

        <p className="text-center">
          Already have an account?{' '}
          <Link href="/signin" className="text-amber-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  )
}
```

### Step 7: Update Header Component

Update `components/header.tsx` to show user info:

```tsx
"use client"

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'

export function Header() {
  const { user, profile, signOut, isAuthenticated } = useAuth()

  return (
    <header className="...">
      {/* ... existing code ... */}
      
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-slate-700">
              {profile?.full_name || user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-slate-700 hover:text-amber-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
```

### Step 8: Protect Dashboard Pages

The middleware automatically protects routes, but you can add additional checks:

```tsx
"use client"

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TenantDashboard() {
  const { loading, isAuthenticated, isTenant } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin')
    } else if (!loading && !isTenant) {
      router.push('/unauthorized')
    }
  }, [loading, isAuthenticated, isTenant, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isTenant) {
    return null
  }

  return (
    <div>
      {/* Your dashboard content */}
    </div>
  )
}
```

---

## 🎯 Usage Examples

### Check Authentication Status

```tsx
const { isAuthenticated, user, profile } = useAuth()

if (isAuthenticated) {
  console.log('User is logged in:', user.email)
  console.log('User role:', profile.role)
}
```

### Check User Role

```tsx
const { isTenant, isLandlord, isAdmin } = useAuth()

if (isTenant) {
  // Show tenant-specific content
}

if (isLandlord) {
  // Show landlord-specific content
}

if (isAdmin) {
  // Show admin-specific content
}
```

### Use Redux State

```tsx
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setProperties } from '@/store/slices/propertiesSlice'

function MyComponent() {
  const dispatch = useAppDispatch()
  const properties = useAppSelector(state => state.properties.properties)
  const user = useAppSelector(state => state.auth.user)

  // Dispatch actions
  dispatch(setProperties(newProperties))
}
```

---

## 🔒 Security Best Practices

### 1. **Never expose service role key**
- Only use in server-side code
- Never commit to Git
- Store in environment variables

### 2. **Always use RLS policies**
- Every table should have RLS enabled
- Test policies thoroughly
- Use `auth.uid()` in policies

### 3. **Validate on server**
- Never trust client-side data
- Always validate in API routes
- Use Supabase RLS as backup

### 4. **Secure API routes**
```tsx
// app/api/properties/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Your logic here
}
```

---

## 🧪 Testing

### Test Sign Up
1. Go to `/signup`
2. Fill in form with role selection
3. Check email for confirmation
4. Verify profile created in Supabase

### Test Sign In
1. Go to `/signin`
2. Enter credentials
3. Should redirect to appropriate dashboard based on role

### Test Protected Routes
1. Sign out
2. Try to access `/tenant`, `/landlord`, or `/admin`
3. Should redirect to `/signin`

### Test Role-Based Access
1. Sign in as tenant
2. Try to access `/landlord`
3. Should redirect to `/unauthorized`

---

## 🐛 Common Issues

### Issue: "Invalid API key"
**Solution:** Check `.env.local` file and restart dev server

### Issue: Profile not created
**Solution:** Check trigger function in Supabase SQL Editor

### Issue: Middleware not working
**Solution:** Ensure middleware.ts is in root directory

### Issue: Redux state not persisting
**Solution:** Redux state is in-memory only. Use Supabase for persistence.

---

## 📚 Next Steps

1. ✅ **Authentication is complete**
2. ⏭️ **Connect properties to Supabase**
3. ⏭️ **Implement favorites functionality**
4. ⏭️ **Build messaging system**
5. ⏭️ **Add file upload for property images**
6. ⏭️ **Implement payment processing**

---

*Last Updated: 2025-10-11*
*Version: 1.0*
*Status: ✅ Ready to Use*
