export function ListingCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="h-56 bg-gradient-to-br from-coffee-100 to-coffee-200 dark:from-coffee-900 dark:to-gray-800" />
      <div className="p-6 space-y-3">
        <div className="h-6 bg-coffee-100 dark:bg-gray-700 rounded-lg w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200 dark:border-gray-700">
          <div className="h-8 bg-coffee-100 dark:bg-coffee-900/30 rounded-lg w-28" />
          <div className="h-7 bg-green-100 dark:bg-green-900/30 rounded-full w-16" />
        </div>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 p-8 animate-pulse">
      <div className="h-7 bg-coffee-100 dark:bg-gray-700 rounded-lg w-32 mb-6 pb-3 border-b-2 border-gray-200 dark:border-gray-700" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ListingDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-coffee-50/30 to-gray-100 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-gradient-to-br from-coffee-100 to-coffee-200 dark:from-coffee-900 dark:to-gray-800" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 p-8 animate-pulse">
              <div className="h-10 bg-coffee-100 dark:bg-gray-700 rounded-lg w-3/4 mb-6" />
              <div className="flex gap-6 mb-8 pb-6 border-b-2 border-gray-200 dark:border-gray-700">
                <div className="h-16 bg-coffee-100 dark:bg-coffee-900/30 rounded-lg w-32" />
                <div className="h-16 bg-green-100 dark:bg-green-900/30 rounded-lg w-32" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
              <div className="h-12 bg-coffee-100 dark:bg-coffee-900/30 rounded-lg w-32 mb-2" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-6" />
              <div className="h-14 bg-coffee-100 dark:bg-coffee-900/30 rounded-xl mb-3" />
              <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-6 bg-coffee-100 dark:bg-gray-700 rounded-lg w-32 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-coffee-50/30 to-gray-100 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-10 bg-coffee-100 dark:bg-gray-700 rounded-lg w-48 mb-3 animate-pulse" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
        </div>
        <div className="space-y-8">
          <ProfileSkeleton />
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border-2 border-gray-100 dark:border-gray-700 animate-pulse">
            <div className="p-8 border-b-2 border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div className="h-8 bg-coffee-100 dark:bg-gray-700 rounded-lg w-48" />
              <div className="h-12 bg-coffee-100 dark:bg-coffee-900/30 rounded-xl w-36" />
            </div>
            <div className="p-8">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b-2 border-gray-200 dark:border-gray-700">
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    </div>
                    <div className="h-10 bg-coffee-100 dark:bg-coffee-900/30 rounded-lg w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
