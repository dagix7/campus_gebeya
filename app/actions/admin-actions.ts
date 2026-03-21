'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResponse, Profile, VerificationLog } from '@/types'

/**
 * Verify current user is an admin
 * Throws error if not authenticated or not admin
 */
async function verifyAdmin(supabase: any) {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('Not authenticated')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    throw new Error('Unauthorized - Admin access required')
  }

  return user
}

/**
 * Get list of all pending verifications for admin review
 * Ordered by submission time (oldest first)
 */
export async function getPendingVerifications(): Promise<Profile[]> {
  try {
    const supabase = await createClient()
    await verifyAdmin(supabase)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('verification_status', 'pending')
      .order('submitted_at', { ascending: true })

    if (error) throw error

    return data || []
  } catch (error: any) {
    console.error('Get pending verifications error:', error)
    return []
  }
}

/**
 * Get verification details for a specific user
 * Includes profile info and verification logs
 */
export async function getVerificationDetails(userId: string): Promise<{
  profile: Profile | null
  logs: VerificationLog[]
}> {
  try {
    const supabase = await createClient()
    await verifyAdmin(supabase)

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    // Get verification logs
    const { data: logs } = await supabase
      .from('verification_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return {
      profile: profile || null,
      logs: logs || []
    }
  } catch (error: any) {
    console.error('Get verification details error:', error)
    return { profile: null, logs: [] }
  }
}

/**
 * Approve a user's verification
 * Sets status to verified and records which university
 */
export async function approveVerification(
  userId: string,
  university: 'AAU' | 'AASTU'
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()
    const admin = await verifyAdmin(supabase)

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        verification_status: 'verified',
        verified_university: university,
        verified_at: new Date().toISOString(),
        rejection_reason: null
      })
      .eq('id', userId)

    if (updateError) {
      return { error: updateError.message }
    }

    // Log action
    await supabase.from('verification_logs').insert([{
      user_id: userId,
      admin_id: admin.id,
      action: 'approved'
    }])

    // TODO: Send email notification to user

    revalidatePath('/admin/verifications')
    return { success: true }

  } catch (error: any) {
    return { error: error.message || 'Failed to approve verification' }
  }
}

/**
 * Reject a user's verification with a reason
 * User can resubmit after rejection
 */
export async function rejectVerification(
  userId: string,
  reason: string
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()
    const admin = await verifyAdmin(supabase)

    if (!reason || reason.trim().length < 10) {
      return { error: 'Please provide a detailed rejection reason (at least 10 characters)' }
    }

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        verification_status: 'rejected',
        rejection_reason: reason.trim(),
        verified_at: null,
        verified_university: null
      })
      .eq('id', userId)

    if (updateError) {
      return { error: updateError.message }
    }

    // Log action
    await supabase.from('verification_logs').insert([{
      user_id: userId,
      admin_id: admin.id,
      action: 'rejected',
      reason: reason.trim()
    }])

    // TODO: Send email notification to user

    revalidatePath('/admin/verifications')
    return { success: true }

  } catch (error: any) {
    return { error: error.message || 'Failed to reject verification' }
  }
}

/**
 * Get signed URL for viewing a user's student ID image
 * URL expires after 5 minutes for security
 */
export async function getStudentIdUrl(userId: string): Promise<string | null> {
  try {
    const supabase = await createClient()
    await verifyAdmin(supabase)

    // Get file path from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('student_id_url')
      .eq('id', userId)
      .single()

    if (!profile?.student_id_url) return null

    // Generate signed URL (valid for 5 minutes)
    const { data } = await supabase.storage
      .from('verification-documents')
      .createSignedUrl(profile.student_id_url, 300)

    return data?.signedUrl || null

  } catch (error) {
    console.error('Get student ID URL error:', error)
    return null
  }
}

/**
 * Get count of pending verifications (for admin dashboard badge)
 */
export async function getPendingCount(): Promise<number> {
  try {
    const supabase = await createClient()
    await verifyAdmin(supabase)

    const { count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('verification_status', 'pending')

    return count || 0
  } catch (error) {
    console.error('Get pending count error:', error)
    return 0
  }
}
