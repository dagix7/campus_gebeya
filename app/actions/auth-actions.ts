'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ActionResponse } from '@/types'
import { z } from 'zod'

// Zod schemas for validation
const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  campus_name: z.string().min(1, 'Please select a campus'),
  telegram_handle: z.string()
    .regex(/^@?[a-zA-Z0-9_]{5,32}$/, 'Invalid Telegram handle. Must be 5-32 characters with only letters, numbers, and underscores'),
})

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
})

export async function signUp(_prevState: any, formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Extract and validate form data with Zod
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      full_name: formData.get('full_name') as string,
      campus_name: formData.get('campus_name') as string,
      telegram_handle: formData.get('telegram_handle') as string,
    }

    const result = signUpSchema.safeParse(rawData)
    if (!result.success) {
      return { error: result.error.issues[0].message }
    }

    const { email, password, full_name, campus_name, telegram_handle } = result.data

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
    // Handle Next.js redirect (it throws)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Sign up error:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}

export async function signIn(_prevState: any, formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Extract and validate form data with Zod
    const rawData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const result = signInSchema.safeParse(rawData)
    if (!result.success) {
      return { error: result.error.issues[0].message }
    }

    const { email, password } = result.data

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
    // Handle Next.js redirect (it throws)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
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
    // Handle Next.js redirect (it throws)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Sign out error:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}
