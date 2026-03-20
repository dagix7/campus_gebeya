'use client'

import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface ShareButtonProps {
  title: string
  url: string
  className?: string
}

export default function ShareButton({ title, url, className = '' }: ShareButtonProps) {
  const handleShare = async () => {
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        })
        toast.success('Shared successfully!')
      } catch (error: any) {
        // User cancelled the share
        if (error.name !== 'AbortError') {
          // Fallback to clipboard
          fallbackShare(url)
        }
      }
    } else {
      // Fallback to clipboard
      fallbackShare(url)
    }
  }

  const fallbackShare = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  return (
    <button
      onClick={handleShare}
      className={`w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 transition ${className}`}
    >
      <Share2 size={20} />
      Share
    </button>
  )
}
