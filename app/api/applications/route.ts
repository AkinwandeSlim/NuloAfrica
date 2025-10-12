import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase/client'
import { notifyApplicationSubmitted } from '@/lib/utils/notifications'
import type { ApplicationInsert } from '@/lib/types/database'

export async function POST(request: Request) {
  try {
    // Get auth token
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user is tenant
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('user_type, full_name')
      .eq('id', user.id)
      .single()

    if (userProfile?.user_type !== 'tenant') {
      return NextResponse.json(
        { success: false, error: 'Only tenants can submit applications' },
        { status: 403 }
      )
    }

    // Check profile completion (NULO GATE)
    const { data: tenant } = await supabaseAdmin
      .from('tenants')
      .select('profile_completion, documents')
      .eq('id', user.id)
      .single()

    if (!tenant || tenant.profile_completion < 100) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Profile incomplete. Complete your profile to apply for properties.',
          profile_completion: tenant?.profile_completion || 0,
        },
        { status: 403 }
      )
    }

    // Parse request body
    const { property_id, message, proposed_move_in_date } = await request.json()

    if (!property_id) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      )
    }

    // Verify property exists and is active
    const { data: property, error: propertyError } = await supabaseAdmin
      .from('properties')
      .select('id, title, landlord_id, status, rent_amount')
      .eq('id', property_id)
      .single()

    if (propertyError || !property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    if (property.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Property is not available for applications' },
        { status: 400 }
      )
    }

    // Check for existing active application
    const { data: existingApp } = await supabaseAdmin
      .from('applications')
      .select('id, status')
      .eq('tenant_id', user.id)
      .eq('property_id', property_id)
      .single()

    if (existingApp) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'You have already applied for this property',
          existing_application: existingApp,
        },
        { status: 400 }
      )
    }

    // Create application
    const applicationData: ApplicationInsert = {
      tenant_id: user.id,
      property_id,
      status: 'submitted',
      documents: tenant.documents || {},
      message: message || null,
      proposed_move_in_date: proposed_move_in_date || null,
      rejection_reason: null,
      reason_code: null,
      reviewed_at: null,
      reviewed_by: null,
    }

    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .insert(applicationData)
      .select()
      .single()

    if (appError) {
      console.error('Application creation error:', appError)
      return NextResponse.json(
        { success: false, error: 'Failed to create application' },
        { status: 500 }
      )
    }

    // Create mock escrow transaction
    const mockRef = `PSK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const { data: transaction } = await supabaseAdmin
      .from('transactions')
      .insert({
        application_id: application.id,
        tenant_id: user.id,
        landlord_id: property.landlord_id,
        property_id,
        amount: property.rent_amount,
        currency: 'NGN',
        status: 'held',
        payment_gateway: 'paystack',
        paystack_ref: mockRef,
        transaction_type: 'rent_payment',
        held_at: new Date().toISOString(),
      })
      .select()
      .single()

    // Send notification to landlord
    await notifyApplicationSubmitted(
      property.landlord_id,
      userProfile.full_name || 'A tenant',
      property.title,
      application.id
    )

    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        status: application.status,
        created_at: application.created_at,
      },
      transaction: transaction ? {
        id: transaction.id,
        status: transaction.status,
        paystack_ref: transaction.paystack_ref,
      } : null,
    })
  } catch (error: any) {
    console.error('Create application error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    // Get auth token
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch applications for tenant
    const { data: applications, error } = await supabaseAdmin
      .from('applications')
      .select(`
        *,
        property:properties(
          id,
          title,
          location,
          rent_amount,
          photos,
          landlord_id
        ),
        landlord:properties!inner(
          landlord:landlords!inner(
            user:users!landlords_id_fkey(
              full_name,
              trust_score
            )
          )
        )
      `)
      .eq('tenant_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch applications error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch applications' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      applications,
    })
  } catch (error: any) {
    console.error('Get applications error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
