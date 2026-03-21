'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-coffee-50/30 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-4">
      <div className="text-center max-w-md">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-red-200/20 dark:bg-red-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-coffee-200/20 dark:bg-coffee-900/10 rounded-full blur-3xl" />
        </div>

        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-gray-700 p-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle size={40} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {error.message || 'An unexpected error occurred. Please try again or return to the homepage.'}
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
              <Home size={18} />
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
