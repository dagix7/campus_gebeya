import { ListingCardSkeleton } from '@/components/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-12 bg-blue-500/30 rounded w-64 mb-4 animate-pulse" />
          <div className="h-6 bg-blue-500/30 rounded w-96 mb-8 animate-pulse" />
          <div className="flex gap-4">
            <div className="h-12 bg-white/20 rounded w-64 animate-pulse" />
            <div className="h-12 bg-white/20 rounded w-40 animate-pulse" />
            <div className="h-12 bg-white/20 rounded w-40 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
