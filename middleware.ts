import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // TEMPORARILY DISABLED: Using FastAPI JWT auth instead of Supabase sessions
  // The middleware was checking for Supabase sessions which don't exist
  // when using FastAPI backend authentication
  
  // TODO: Update this middleware to check for JWT tokens in cookies/headers
  // or handle auth protection in individual page components
  
  return NextResponse.next()
  
  /* ORIGINAL CODE - DISABLED
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/properties', '/signin', '/signup', '/forgot-password', '/landing']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Auth routes (redirect to dashboard if already logged in)
  const authRoutes = ['/signin', '/signup']
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/tenant', '/landlord', '/admin', '/favorites', '/messages', '/profile']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // If user is logged in and trying to access auth pages, redirect to appropriate dashboard
  if (session && isAuthRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile) {
      const dashboardRoute = getDashboardRoute(profile.role)
      return NextResponse.redirect(new URL(dashboardRoute, req.url))
    }
  }

  // If user is not logged in and trying to access protected routes, redirect to signin
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/signin', req.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Role-based access control
  if (session && isProtectedRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile) {
      // Admin routes - only admins can access
      if (pathname.startsWith('/admin') && profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }

      // Landlord routes - only landlords can access
      if (pathname.startsWith('/landlord') && profile.role !== 'landlord') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }

      // Tenant routes - only tenants can access
      if (pathname.startsWith('/tenant') && profile.role !== 'tenant') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }
  }

  return res
  */
}

function getDashboardRoute(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'landlord':
      return '/landlord'
    case 'tenant':
      return '/tenant'
    default:
      return '/dashboard'
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
