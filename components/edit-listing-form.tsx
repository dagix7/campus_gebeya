'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateListing } from '@/app/actions/listing-actions'
import { toast } from 'sonner'
import { CATEGORY_OPTIONS } from '@/lib/utils'
import Image from 'next/image'
import { Upload } from 'lucide-react'
import type { Listing } from '@/types'

interface EditListingFormProps {
  listing: Listing
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-coffee-900 dark:bg-coffee-700 text-white py-3 rounded-lg font-semibold hover:bg-coffee-800 dark:hover:bg-coffee-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Updating...' : 'Update Listing'}
    </button>
  )
}

export default function EditListingForm({ listing }: EditListingFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(listing.image_url)
  const updateListingWithId = updateListing.bind(null, listing.id)
  const [state, formAction] = useActionState(updateListingWithId, null)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form action={formAction} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-coffee-200 dark:border-gray-700 p-8 md:p-10 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 space-y-6">
      {/* Decorative top bar */}
      <div className="flex gap-2 mb-4 pb-6 border-b-2 border-coffee-100 dark:border-gray-700">
        <div className="w-3 h-3 rounded-full bg-coffee-900" />
        <div className="w-3 h-3 rounded-full bg-earth-400" />
        <div className="w-3 h-3 rounded-full bg-coffee-700" />
      </div>
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          defaultValue={listing.title}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-transparent outline-none"
          placeholder="e.g., MacBook Pro 2020"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category *
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue={listing.category}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-transparent outline-none"
        >
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Price (ETB) *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          required
          min="1"
          defaultValue={listing.price_etb}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-transparent outline-none"
          placeholder="e.g., 15000"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          defaultValue={listing.description}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-transparent outline-none"
          placeholder="Describe your item or service in detail..."
        />
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Image (optional - leave empty to keep current image)
        </label>
        <div className="flex flex-col items-center justify-center w-full">
          {imagePreview && (
            <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden bg-coffee-50 dark:bg-coffee-900">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-contain p-2"
              />
            </div>
          )}
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400 dark:text-gray-500" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, or WEBP (max 10MB)</p>
            </div>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      <SubmitButton />
    </form>
  )
}
