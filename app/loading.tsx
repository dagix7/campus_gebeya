import { ListingCardSkeleton } from '@/components/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-coffee-50/30 to-gray-100 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-coffee-900 to-coffee-700 dark:from-coffee-800 dark:to-coffee-600 text-white py-16 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 bg-coffee-800/50 dark:bg-coffee-700/50 rounded-lg w-64 mb-4 animate-pulse" />
          <div className="h-7 bg-coffee-800/50 dark:bg-coffee-700/50 rounded-lg w-96 mb-10 animate-pulse" />
          <div className="flex gap-3 flex-wrap">
            <div className="h-14 bg-white/20 rounded-lg w-64 animate-pulse" />
            <div className="h-14 bg-white/20 rounded-lg w-40 animate-pulse" />
            <div className="h-14 bg-white/20 rounded-lg w-40 animate-pulse" />
            <div className="h-14 bg-white/20 rounded-lg w-40 animate-pulse" />
            <div className="h-14 bg-white/20 rounded-lg w-32 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 animate-pulse" />
          <div className="h-12 bg-coffee-100 dark:bg-coffee-900/30 rounded-xl w-36 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
