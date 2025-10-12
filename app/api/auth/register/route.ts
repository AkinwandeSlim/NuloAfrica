import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase/client'
import type { UserType } from '@/lib/types/database'

export async function POST(request: Request) {
  try {
    const { email, password, phone_number, full_name, user_type } = await request.json()

    // Validate required fields
    if (!email || !password || !full_name || !user_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate user type
    if (!['tenant', 'landlord'].includes(user_type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user type' },
        { status: 400 }
      )
    }

    // Create auth user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          user_type,
          phone_number,
        },
      },
    })

    if (authError) {
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Create user record in users table
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        phone_number: phone_number || null,
        full_name,
        user_type: user_type as UserType,
        trust_score: 50,
        verification_status: 'partial',
      })

    if (userError) {
      console.error('Error creating user record:', userError)
      // Rollback: delete auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { success: false, error: 'Failed to create user profile' },
        { status: 500 }
      )
    }

    // Create type-specific record
    if (user_type === 'tenant') {
      const { error: tenantError } = await supabaseAdmin
        .from('tenants')
        .insert({
          id: authData.user.id,
          profile_completion: 0,
          onboarding_completed: false,
        })

      if (tenantError) {
        console.error('Error creating tenant record:', tenantError)
      }
    } else if (user_type === 'landlord') {
      const { error: landlordError } = await supabaseAdmin
        .from('landlords')
        .insert({
          id: authData.user.id,
          guarantee_joined: false,
          guarantee_contribution: 0,
        })

      if (landlordError) {
        console.error('Error creating landlord record:', landlordError)
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        user_type,
        trust_score: 50,
      },
      session: authData.session,
      message: 'Registration successful! Please check your email to verify your account.',
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
