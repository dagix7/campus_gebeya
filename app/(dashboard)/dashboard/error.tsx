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
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <AlertCircle size={64} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Dashboard Error
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'Failed to load dashboard. Please try again.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Retry
          </button>
          <Link
            href="/"
            className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
