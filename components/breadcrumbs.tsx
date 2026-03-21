import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        <li className="flex items-center">
          <Link
            href="/"
            className="text-gray-500 dark:text-gray-400 hover:text-coffee-700 dark:hover:text-coffee-400 transition-colors flex items-center gap-1"
          >
            <Home size={16} />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight size={16} className="text-gray-400 dark:text-gray-500 mx-1" aria-hidden="true" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-500 dark:text-gray-400 hover:text-coffee-700 dark:hover:text-coffee-400 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-gray-100 font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
