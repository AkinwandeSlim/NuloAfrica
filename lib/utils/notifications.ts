import { supabaseAdmin } from '@/lib/supabase/client'
import type { NotificationInsert, NotificationType } from '@/lib/types/database'

/**
 * Create a notification for a user
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  options?: {
    relatedId?: string
    relatedType?: string
    actionUrl?: string
  }
): Promise<void> {
  try {
    const notification: NotificationInsert = {
      user_id: userId,
      title,
      message,
      notification_type: type,
      related_id: options?.relatedId || null,
      related_type: options?.relatedType || null,
      action_url: options?.actionUrl || null,
    }

    const { error } = await supabaseAdmin
      .from('notifications')
      .insert(notification)

    if (error) throw error
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

/**
 * Notification templates for common events
 */

export async function notifyApplicationSubmitted(
  landlordId: string,
  tenantName: string,
  propertyTitle: string,
  applicationId: string
): Promise<void> {
  await createNotification(
    landlordId,
    'application_submitted',
    'New Application Received',
    `${tenantName} has applied for your property "${propertyTitle}"`,
    {
      relatedId: applicationId,
      relatedType: 'application',
      actionUrl: `/landlord/applications/${applicationId}`,
    }
  )
}

export async function notifyApplicationApproved(
  tenantId: string,
  propertyTitle: string,
  applicationId: string
): Promise<void> {
  await createNotification(
    tenantId,
    'application_approved',
    'Application Approved! 🎉',
    `Congratulations! Your application for "${propertyTitle}" has been approved.`,
    {
      relatedId: applicationId,
      relatedType: 'application',
      actionUrl: `/tenant/applications/${applicationId}`,
    }
  )
}

export async function notifyApplicationRejected(
  tenantId: string,
  propertyTitle: string,
  reason: string,
  applicationId: string
): Promise<void> {
  await createNotification(
    tenantId,
    'application_rejected',
    'Application Update',
    `Your application for "${propertyTitle}" was not approved. Reason: ${reason}`,
    {
      relatedId: applicationId,
      relatedType: 'application',
      actionUrl: `/tenant/applications/${applicationId}`,
    }
  )
}

export async function notifyNewMessage(
  recipientId: string,
  senderName: string,
  messagePreview: string,
  conversationUrl: string
): Promise<void> {
  await createNotification(
    recipientId,
    'new_message',
    `New message from ${senderName}`,
    messagePreview.substring(0, 100),
    {
      relatedType: 'message',
      actionUrl: conversationUrl,
    }
  )
}

export async function notifyPropertyVerified(
  landlordId: string,
  propertyTitle: string,
  propertyId: string,
  approved: boolean
): Promise<void> {
  await createNotification(
    landlordId,
    'property_verified',
    approved ? 'Property Verified ✓' : 'Property Verification Failed',
    approved
      ? `Your property "${propertyTitle}" has been verified and is now live!`
      : `Your property "${propertyTitle}" needs additional information for verification.`,
    {
      relatedId: propertyId,
      relatedType: 'property',
      actionUrl: `/landlord/properties/${propertyId}`,
    }
  )
}

export async function notifyPaymentReceived(
  landlordId: string,
  amount: number,
  tenantName: string,
  propertyTitle: string
): Promise<void> {
  await createNotification(
    landlordId,
    'payment_received',
    'Payment Received',
    `You received ₦${amount.toLocaleString()} from ${tenantName} for "${propertyTitle}"`,
    {
      relatedType: 'transaction',
      actionUrl: '/landlord/payments',
    }
  )
}

export async function notifyProfileIncomplete(
  tenantId: string,
  completionPercentage: number
): Promise<void> {
  await createNotification(
    tenantId,
    'profile_incomplete',
    'Complete Your Profile',
    `Your profile is ${completionPercentage}% complete. Complete it to apply for properties!`,
    {
      actionUrl: '/tenant/profile',
    }
  )
}

export async function notifySystemAnnouncement(
  userIds: string[],
  title: string,
  message: string
): Promise<void> {
  const notifications = userIds.map(userId => ({
    user_id: userId,
    title,
    message,
    notification_type: 'system_announcement' as NotificationType,
    related_id: null,
    related_type: null,
    action_url: null,
  }))

  const { error } = await supabaseAdmin
    .from('notifications')
    .insert(notifications)

  if (error) {
    console.error('Error creating system announcements:', error)
    throw error
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('notifications')
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)

  if (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('notifications')
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) {
    console.error('Error marking all notifications as read:', error)
    throw error
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) {
    console.error('Error getting unread count:', error)
    return 0
  }

  return count || 0
}
