'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ActionResponse } from '@/types'
import { z } from 'zod'

// Zod schemas for validation
const createListingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must not exceed 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description must not exceed 1000 characters'),
  price: z.coerce.number().int('Price must be a whole number').min(1, 'Price must be at least 1 ETB').max(1000000, 'Price must not exceed 1,000,000 ETB'),
  category: z.enum(['Gear', 'Gigs', 'Jobs', 'Freelance', 'Courses', 'Dorm Life', 'Other'], { message: 'Please select a valid category' }),
})

const updateListingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must not exceed 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description must not exceed 1000 characters'),
  price: z.coerce.number().int('Price must be a whole number').min(1, 'Price must be at least 1 ETB').max(1000000, 'Price must not exceed 1,000,000 ETB'),
  category: z.enum(['Gear', 'Gigs', 'Jobs', 'Freelance', 'Courses', 'Dorm Life', 'Other'], { message: 'Please select a valid category' }),
})

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

function validateImage(file: File | null, required: boolean): string | null {
  if (!file || file.size === 0) {
    return required ? 'Please select an image' : null
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return 'Image must be less than 10MB'
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Image must be JPEG, PNG, or WebP'
  }
  return null
}

export async function createListing(_prevState: any, formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'You must be logged in to create a listing' }
    }

    // Extract and validate form data with Zod
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      category: formData.get('category') as string,
    }

    const result = createListingSchema.safeParse(rawData)
    if (!result.success) {
      return { error: result.error.issues[0].message }
    }

    // Validate image separately (File objects need special handling)
    const image = formData.get('image') as File
    const imageError = validateImage(image, true)
    if (imageError) {
      return { error: imageError }
    }

    const { title, description, price, category } = result.data

    // Upload image
    const timestamp = Date.now()
    const fileName = `${timestamp}_${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const { error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(fileName, image, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      return { error: `Image upload failed: ${uploadError.message}` }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(fileName)

    // Create listing
    const { data, error } = await supabase
      .from('listings')
      .insert([{
        title,
        description,
        price_etb: price,
        category,
        image_url: urlData.publicUrl,
        user_id: user.id,
        status: 'Active',
      }])
      .select()
      .single()

    if (error) {
      return { error: `Failed to create listing: ${error.message}` }
    }

    // Revalidate and redirect
    revalidatePath('/')
    revalidatePath('/dashboard')
    redirect(`/listings/${data.id}`)
  } catch (error: any) {
    // Handle Next.js redirect (it throws)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Create listing error:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}

export async function updateListing(id: string, _prevState: any, formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'You must be logged in to update a listing' }
    }

    // Extract and validate form data with Zod
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      category: formData.get('category') as string,
    }

    const result = updateListingSchema.safeParse(rawData)
    if (!result.success) {
      return { error: result.error.issues[0].message }
    }

    // Validate image if provided
    const image = formData.get('image') as File
    const imageError = validateImage(image, false)
    if (imageError) {
      return { error: imageError }
    }

    const { title, description, price, category } = result.data

    const updates: any = {
      title,
      description,
      price_etb: price,
      category,
    }

    // Handle optional image update
    if (image && image.size > 0) {
      const timestamp = Date.now()
      const fileName = `${timestamp}_${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, image, {
          cacheControl: '3600',
          upsert: false
        })

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('listing-images')
          .getPublicUrl(fileName)
        updates.image_url = urlData.publicUrl
      }
    }

    // Update listing
    const { error } = await supabase
      .from('listings')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return { error: `Failed to update listing: ${error.message}` }
    }

    // Revalidate and redirect
    revalidatePath(`/listings/${id}`)
    revalidatePath('/dashboard')
    revalidatePath('/')
    redirect(`/listings/${id}`)
  } catch (error: any) {
    // Handle Next.js redirect (it throws)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Update listing error:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}

export async function deleteListing(id: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'You must be logged in to delete a listing' }
    }

    // Validate ID format (UUID)
    const uuidSchema = z.string().uuid('Invalid listing ID')
    const idResult = uuidSchema.safeParse(id)
    if (!idResult.success) {
      return { error: 'Invalid listing ID' }
    }

    // Delete listing
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return { error: `Failed to delete listing: ${error.message}` }
    }

    // Revalidate and redirect
    revalidatePath('/dashboard')
    revalidatePath('/')
    redirect('/dashboard')
  } catch (error: any) {
    // Handle Next.js redirect (it throws)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Delete listing error:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}

export async function toggleListingStatus(id: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'You must be logged in' }
    }

    // Validate ID format (UUID)
    const uuidSchema = z.string().uuid('Invalid listing ID')
    const idResult = uuidSchema.safeParse(id)
    if (!idResult.success) {
      return { error: 'Invalid listing ID' }
    }

    // Get current listing
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !listing) {
      return { error: 'Listing not found' }
    }

    const newStatus = listing.status === 'Active' ? 'Sold' : 'Active'

    // Update status
    const { error } = await supabase
      .from('listings')
      .update({ status: newStatus })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return { error: `Failed to update status: ${error.message}` }
    }

    // Revalidate
    revalidatePath(`/listings/${id}`)
    revalidatePath('/dashboard')
    revalidatePath('/')

    return { success: true }
  } catch (error: any) {
    console.error('Toggle status error:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}
