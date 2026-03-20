'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Listing error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle size={64} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Failed to Load Listing
          </h2>
          <p className="text-gray-600 mb-6">
            {error.message || 'The listing could not be loaded. It may have been deleted or you may not have permission to view it.'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={reset}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Try again
            </button>
            <Link
              href="/"
              className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Back to listings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
