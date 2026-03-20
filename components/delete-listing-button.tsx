'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteListing } from '@/app/actions/listing-actions'
import { toast } from 'sonner'
import ConfirmationDialog from './confirmation-dialog'

interface DeleteListingButtonProps {
  listingId: string
  listingTitle: string
}

export default function DeleteListingButton({ listingId, listingTitle }: DeleteListingButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deleteListing(listingId)

      if (result?.error) {
        toast.error(result.error)
        setLoading(false)
        setShowDialog(false)
      } else {
        toast.success('Listing deleted successfully')
        // Redirect happens in server action
      }
    } catch (error: any) {
      // Handle redirect
      if (error.message && error.message.includes('NEXT_REDIRECT')) {
        throw error
      }
      toast.error('Failed to delete listing')
      setLoading(false)
      setShowDialog(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition"
        aria-label="Delete listing"
      >
        <Trash2 size={16} />
        Delete
      </button>

      <ConfirmationDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleDelete}
        title="Delete Listing"
        description={`Are you sure you want to delete "${listingTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={loading}
        danger
      />
    </>
  )
}
