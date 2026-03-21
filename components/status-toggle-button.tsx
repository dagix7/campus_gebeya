'use client'

import { useState } from 'react'
import { CheckCircle, Circle, Loader2 } from 'lucide-react'
import { toggleListingStatus } from '@/app/actions/listing-actions'
import { toast } from 'sonner'

interface StatusToggleButtonProps {
  listingId: string
  currentStatus: string
  onStatusChange?: (newStatus: string) => void
}

export default function StatusToggleButton({
  listingId,
  currentStatus,
  onStatusChange
}: StatusToggleButtonProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(currentStatus)

  const isActive = status === 'Active'

  const handleToggle = async () => {
    setLoading(true)
    try {
      const result = await toggleListingStatus(listingId)

      if (result?.error) {
        toast.error(result.error)
      } else {
        const newStatus = isActive ? 'Sold' : 'Active'
        setStatus(newStatus)
        onStatusChange?.(newStatus)
        toast.success(`Listing marked as ${newStatus}`)
      }
    } catch (error: any) {
      toast.error('Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
        isActive
          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={isActive ? 'Mark as sold' : 'Mark as active'}
      title={isActive ? 'Click to mark as sold' : 'Click to mark as active'}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : isActive ? (
        <CheckCircle size={14} />
      ) : (
        <Circle size={14} />
      )}
      {status}
    </button>
  )
}
