'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ActionResponse } from '@/types'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']

/**
 * Upload student ID for verification
 * Accepts file and OCR results from client, stores in private bucket
 * Sets verification status based on OCR confidence
 */
export async function uploadStudentId(
  _prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'You must be logged in' }
    }

    // Get file and OCR result from formData
    const file = formData.get('student_id') as File
    const ocrConfidence = formData.get('ocr_confidence') as string
    const ocrText = formData.get('ocr_text') as string

    // Validate file
    if (!file || file.size === 0) {
      return { error: 'Please select your student ID image' }
    }

    if (file.size > MAX_FILE_SIZE) {
      return { error: 'File must be less than 10MB' }
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return { error: 'File must be JPG, PNG, or PDF' }
    }

    // Determine status based on OCR result
    let status: 'pending' | 'rejected' = 'pending'
    let rejectionReason = null

    if (ocrConfidence === 'no_match') {
      status = 'rejected'
      rejectionReason = 'University not detected in ID image. Please ensure your ID clearly shows AAU or AASTU and upload a clearer photo.'
    }

    // Upload to private bucket with user ID folder
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}_student_id.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('verification-documents')
      .upload(fileName, file, {
        upsert: true // Allow resubmission (overwrites previous file)
      })

    if (uploadError) {
      return { error: `Upload failed: ${uploadError.message}` }
    }

    // Update profile with verification status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        verification_status: status,
        student_id_url: fileName,
        submitted_at: new Date().toISOString(),
        ocr_confidence: ocrConfidence,
        rejection_reason: rejectionReason
      })
      .eq('id', user.id)

    if (updateError) {
      return { error: `Profile update failed: ${updateError.message}` }
    }

    // Log the action
    await supabase.from('verification_logs').insert([{
      user_id: user.id,
      action: 'submitted',
      metadata: { ocr_confidence: ocrConfidence, ocr_text: ocrText?.substring(0, 200) }
    }])

    revalidatePath('/auth/verify-id')

    if (status === 'rejected') {
      redirect('/auth/verify-id/rejected')
    } else {
      redirect('/auth/verify-id/pending')
    }

  } catch (error: any) {
    // Handle Next.js redirect (it throws)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Upload error:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}

/**
 * Get current user's verification status
 * Returns status, rejection reason, and submission timestamp
 */
export async function getVerificationStatus(): Promise<{
  status: string
  reason?: string
  submittedAt?: string
  ocrConfidence?: string
} | null> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
      .from('profiles')
      .select('verification_status, rejection_reason, submitted_at, ocr_confidence')
      .eq('id', user.id)
      .single()

    return {
      status: data?.verification_status || 'unverified',
      reason: data?.rejection_reason || undefined,
      submittedAt: data?.submitted_at || undefined,
      ocrConfidence: data?.ocr_confidence || undefined
    }
  } catch (error) {
    console.error('Get status error:', error)
    return null
  }
}
