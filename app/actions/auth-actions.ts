'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ActionResponse } from '@/types'

export async function signUp(_prevState: any, formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Extract form data
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string
    const campus_name = formData.get('campus_name') as string
    const telegram_handle = formData.get('telegram_handle') as string

    // Validation
    if (!email || !email.includes('@')) {
      return { error: 'Please enter a valid email address' }
    }
    if (!password || password.length < 6) {
      return { error: 'Password must be at least 6 characters' }
    }
    if (!full_name || full_name.length < 2) {
      return { error: 'Name must be at least 2 characters' }
    }
    if (!campus_name) {
      return { error: 'Please select a campus' }
    }
    if (!telegram_handle || !telegram_handle.match(/^@?[a-zA-Z0-9_]{5,32}$/)) {
      return { error: 'Invalid Telegram handle. Must be 5-32 characters' }
    }

    // Create auth user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      return { error: signUpError.message }
    }

    if (!data.user) {
      return { error: 'Failed to create account' }
    }

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: data.user.id,
        full_name: full_name.trim(),
        campus_name,
        telegram_handle: telegram_handle.startsWith('@') ? telegram_handle : `@${telegram_handle}`,
      },
    ])

    if (profileError) {
      return { error: `Account created but profile setup failed: ${profileError.message}` }
    }

    revalidatePath('/')
    redirect('/auth/login?message=Account created successfully. Please log in.')
  } catch (error: any) {
    // If it's a redirect, rethrow it
    if (error.message && error.message.includes('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Sign up error:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}

export async function signIn(_prevState: any, formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Extract form data
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validation
    if (!email || !email.includes('@')) {
      return { error: 'Please enter a valid email address' }
    }
    if (!password) {
      return { error: 'Please enter your password' }
    }

    // Sign in
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: 'Invalid email or password' }
    }

    revalidatePath('/')
    redirect('/dashboard')
  } catch (error: any) {
    // If it's a redirect, rethrow it
    if (error.message && error.message.includes('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Sign in error:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}

export async function signOut(): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/')
    redirect('/')
  } catch (error: any) {
    // If it's a redirect, rethrow it
    if (error.message && error.message.includes('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Sign out error:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}
