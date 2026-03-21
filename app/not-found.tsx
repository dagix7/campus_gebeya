import Link from 'next/link'
import { Search, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-coffee-50/30 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-coffee-200/30 dark:bg-coffee-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-earth-200/30 dark:bg-earth-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-gray-700 p-10">
          {/* 404 Number */}
          <div className="mb-6">
            <span className="text-8xl font-bold bg-gradient-to-r from-coffee-600 to-coffee-900 dark:from-coffee-400 dark:to-coffee-600 bg-clip-text text-transparent">
              404
            </span>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-coffee-100 dark:bg-coffee-900/30 rounded-full flex items-center justify-center">
              <Search size={40} className="text-coffee-600 dark:text-coffee-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-coffee-900 dark:bg-coffee-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-coffee-800 dark:hover:bg-coffee-600 transition shadow-md hover:shadow-lg"
            >
              <Home size={18} />
              Go to Homepage
            </Link>
            <button
              onClick={() => typeof window !== 'undefined' && window.history.back()}
              className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Here are some helpful links:
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link href="/" className="text-coffee-700 dark:text-coffee-400 hover:text-coffee-800 dark:hover:text-coffee-300 font-medium">
                Browse Listings
              </Link>
              <Link href="/listings/new" className="text-coffee-700 dark:text-coffee-400 hover:text-coffee-800 dark:hover:text-coffee-300 font-medium">
                Sell an Item
              </Link>
              <Link href="/auth/login" className="text-coffee-700 dark:text-coffee-400 hover:text-coffee-800 dark:hover:text-coffee-300 font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
