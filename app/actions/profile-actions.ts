'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResponse } from '@/types'

export async function updateProfile(_prevState: any, formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'You must be logged in to update your profile' }
    }

    // Extract form data
    const full_name = formData.get('full_name') as string
    const campus_name = formData.get('campus_name') as string
    const telegram_handle = formData.get('telegram_handle') as string

    // Validation
    if (!full_name || full_name.length < 2) {
      return { error: 'Name must be at least 2 characters' }
    }
    if (!campus_name) {
      return { error: 'Please select a campus' }
    }
    if (!telegram_handle || !telegram_handle.match(/^@?[a-zA-Z0-9_]{5,32}$/)) {
      return { error: 'Invalid Telegram handle. Must be 5-32 characters with only letters, numbers, and underscores' }
    }

    const updates = {
      full_name: full_name.trim(),
      campus_name,
      telegram_handle: telegram_handle.startsWith('@') ? telegram_handle : `@${telegram_handle}`,
    }

    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) {
      return { error: `Failed to update profile: ${error.message}` }
    }

    // Revalidate
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/profile')

    return { success: true }
  } catch (error: any) {
    console.error('Update profile error:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}
