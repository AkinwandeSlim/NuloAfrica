import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase/client'

export async function GET(request: Request) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Fetch complete user profile
    const { data: userProfile, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userError || !userProfile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Fetch type-specific data
    let typeSpecificData = null
    if (userProfile.user_type === 'tenant') {
      const { data: tenant } = await supabaseAdmin
        .from('tenants')
        .select('*')
        .eq('id', user.id)
        .single()
      typeSpecificData = tenant
    } else if (userProfile.user_type === 'landlord') {
      const { data: landlord } = await supabaseAdmin
        .from('landlords')
        .select('*')
        .eq('id', user.id)
        .single()
      typeSpecificData = landlord
    } else if (userProfile.user_type === 'admin') {
      const { data: admin } = await supabaseAdmin
        .from('admins')
        .select('*')
        .eq('id', user.id)
        .single()
      typeSpecificData = admin
    }

    return NextResponse.json({
      success: true,
      user: {
        ...userProfile,
        ...typeSpecificData,
      },
    })
  } catch (error: any) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
