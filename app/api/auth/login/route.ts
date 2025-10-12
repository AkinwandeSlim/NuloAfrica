import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 401 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 401 }
      )
    }

    // Fetch user details from users table
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, user_type, trust_score, verification_status, avatar_url')
      .eq('id', authData.user.id)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Update last login timestamp
    await supabaseAdmin
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id)

    // Fetch type-specific data
    let profileData = null
    if (user.user_type === 'tenant') {
      const { data: tenant } = await supabaseAdmin
        .from('tenants')
        .select('profile_completion, onboarding_completed')
        .eq('id', user.id)
        .single()
      profileData = tenant
    } else if (user.user_type === 'landlord') {
      const { data: landlord } = await supabaseAdmin
        .from('landlords')
        .select('guarantee_joined, verification_approved_at')
        .eq('id', user.id)
        .single()
      profileData = landlord
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        ...profileData,
      },
      session: authData.session,
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
