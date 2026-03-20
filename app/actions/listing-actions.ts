'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ActionResponse } from '@/types'

export async function createListing(_prevState: any, formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { error: 'You must be logged in to create a listing' }
    }

    // Extract form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priceStr = formData.get('price') as string
    const category = formData.get('category') as string
    const image = formData.get('image') as File

    // Validation
    if (!title || title.length < 5) {
      return { error: 'Title must be at least 5 characters' }
    }
    if (!description || description.length < 20) {
      return { error: 'Description must be at least 20 characters' }
    }
    if (!priceStr || isNaN(parseInt(priceStr)) || parseInt(priceStr) < 1) {
      return { error: 'Please enter a valid price' }
    }
    if (!category || !['Gear', 'Gigs'].includes(category)) {
      return { error: 'Please select a valid category' }
    }
    if (!image || !image.size) {
      return { error: 'Please select an image' }
    }
    if (image.size > 10 * 1024 * 1024) {
      return { error: 'Image must be less than 10MB' }
    }

    const price = parseInt(priceStr)

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

    // Extract form data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priceStr = formData.get('price') as string
    const category = formData.get('category') as string
    const image = formData.get('image') as File

    // Validation
    if (!title || title.length < 5) {
      return { error: 'Title must be at least 5 characters' }
    }
    if (!description || description.length < 20) {
      return { error: 'Description must be at least 20 characters' }
    }
    if (!priceStr || isNaN(parseInt(priceStr)) || parseInt(priceStr) < 1) {
      return { error: 'Please enter a valid price' }
    }
    if (!category || !['Gear', 'Gigs'].includes(category)) {
      return { error: 'Please select a valid category' }
    }

    const price = parseInt(priceStr)

    const updates: any = {
      title,
      description,
      price_etb: price,
      category,
    }

    // Handle optional image update
    if (image && image.size > 0) {
      if (image.size > 10 * 1024 * 1024) {
        return { error: 'Image must be less than 10MB' }
      }

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
    // If it's a redirect, rethrow it
    if (error.message && error.message.includes('NEXT_REDIRECT')) {
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
