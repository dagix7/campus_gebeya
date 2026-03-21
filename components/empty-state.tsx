import Link from 'next/link'
import { Package, Search, ShoppingBag, Plus } from 'lucide-react'

type EmptyStateVariant = 'listings' | 'search' | 'dashboard'

interface EmptyStateProps {
  variant?: EmptyStateVariant
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

const variantConfig: Record<EmptyStateVariant, {
  icon: typeof Package
  title: string
  description: string
  actionLabel: string
  actionHref: string
}> = {
  listings: {
    icon: ShoppingBag,
    title: 'No listings yet',
    description: 'Start selling by creating your first listing',
    actionLabel: 'Create Listing',
    actionHref: '/listings/new',
  },
  search: {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search or filters',
    actionLabel: 'Clear Filters',
    actionHref: '/',
  },
  dashboard: {
    icon: Package,
    title: 'No listings yet',
    description: 'Create your first listing to start selling',
    actionLabel: 'Create Listing',
    actionHref: '/listings/new',
  },
}

export default function EmptyState({
  variant = 'listings',
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  const displayTitle = title || config.title
  const displayDescription = description || config.description
  const displayActionLabel = actionLabel || config.actionLabel
  const displayActionHref = actionHref || config.actionHref

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-24 h-24 mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <Icon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
        {displayTitle}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-sm">
        {displayDescription}
      </p>
      <Link
        href={displayActionHref}
        className="inline-flex items-center gap-2 bg-coffee-900 dark:bg-coffee-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-coffee-800 dark:hover:bg-coffee-600 transition"
      >
        <Plus size={18} />
        {displayActionLabel}
      </Link>
    </div>
  )
}
