import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, full_name')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                ADMIN
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {profile.full_name}
              </span>
              <Link
                href="/dashboard"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Admin Navigation */}
          <nav className="flex space-x-6 border-t border-gray-200 pt-3 -mb-px">
            <Link
              href="/admin/verifications"
              className="pb-3 px-1 border-b-2 border-blue-500 text-sm font-medium text-blue-600"
            >
              Verifications
            </Link>
            {/* Add more admin nav items in future */}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
