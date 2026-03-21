'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, RefreshCw, Home } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-coffee-50/30 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-gray-700 p-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <LayoutDashboard size={40} className="text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Dashboard Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {error.message || 'Failed to load your dashboard. Please try again or return home.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-coffee-900 dark:bg-coffee-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-coffee-800 dark:hover:bg-coffee-600 transition shadow-md hover:shadow-lg"
            >
              <RefreshCw size={18} />
              Retry
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
