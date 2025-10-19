import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { notifyApplicationApproved } from '@/lib/utils/notifications'
import { updateUserTrustScore } from '@/lib/utils/trustScore'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const applicationId = params.id

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

    // Fetch application with property details
    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .select(`
        *,
        property:properties(
          id,
          title,
          landlord_id
        )
      `)
      .eq('id', applicationId)
      .single()

    if (appError || !application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      )
    }

    // Verify landlord owns the property
    if (application.property.landlord_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to approve this application' },
        { status: 403 }
      )
    }

    // Check if already approved/rejected
    if (application.status !== 'submitted' && application.status !== 'under_review') {
      return NextResponse.json(
        { success: false, error: `Application is already ${application.status}` },
        { status: 400 }
      )
    }

    // Update application status
    const { data: updatedApp, error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq('id', applicationId)
      .select()
      .single()

    if (updateError) {
      console.error('Update application error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to approve application' },
        { status: 500 }
      )
    }

    // Update transaction status to released
    await supabaseAdmin
      .from('transactions')
      .update({
        status: 'released',
        released_at: new Date().toISOString(),
      })
      .eq('application_id', applicationId)

    // Update property status to rented
    await supabaseAdmin
      .from('properties')
      .update({ status: 'rented' })
      .eq('id', application.property_id)

    // Update trust scores for both parties (+5 bonus)
    try {
      await updateUserTrustScore(application.tenant_id)
      await updateUserTrustScore(application.property.landlord_id)
    } catch (error) {
      console.error('Error updating trust scores:', error)
    }

    // Send notification to tenant
    await notifyApplicationApproved(
      application.tenant_id,
      application.property.title,
      applicationId
    )

    return NextResponse.json({
      success: true,
      application: {
        id: updatedApp.id,
        status: updatedApp.status,
        reviewed_at: updatedApp.reviewed_at,
      },
    })
  } catch (error: any) {
    console.error('Approve application error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
