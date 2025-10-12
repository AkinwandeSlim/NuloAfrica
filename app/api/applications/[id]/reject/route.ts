import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase/client'
import { notifyApplicationRejected } from '@/lib/utils/notifications'

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

    // Parse request body
    const { reason, reason_code } = await request.json()

    if (!reason || !reason_code) {
      return NextResponse.json(
        { success: false, error: 'Rejection reason and code are required' },
        { status: 400 }
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
        { success: false, error: 'You do not have permission to reject this application' },
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
        status: 'rejected',
        rejection_reason: reason,
        reason_code,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq('id', applicationId)
      .select()
      .single()

    if (updateError) {
      console.error('Update application error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to reject application' },
        { status: 500 }
      )
    }

    // Update transaction status to refunded
    await supabaseAdmin
      .from('transactions')
      .update({
        status: 'refunded',
        refunded_at: new Date().toISOString(),
      })
      .eq('application_id', applicationId)

    // Send notification to tenant
    await notifyApplicationRejected(
      application.tenant_id,
      application.property.title,
      reason,
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
    console.error('Reject application error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
