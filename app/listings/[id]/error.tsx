'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Package, RefreshCw, ArrowLeft } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-coffee-50/30 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-gray-700 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-coffee-100 dark:bg-coffee-900/30 rounded-full flex items-center justify-center">
              <Package size={40} className="text-coffee-600 dark:text-coffee-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Failed to Load Listing
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {error.message || 'This listing could not be loaded. It may have been removed or you may not have permission to view it.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-coffee-900 dark:bg-coffee-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-coffee-800 dark:hover:bg-coffee-600 transition shadow-md hover:shadow-lg"
            >
              <RefreshCw size={18} />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <ArrowLeft size={18} />
              Back to listings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
