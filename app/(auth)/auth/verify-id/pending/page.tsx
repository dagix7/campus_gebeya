import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verification Pending | CampusGebeya',
  description: 'Your student ID is being reviewed by our team',
}

export default async function PendingPage() {
  const supabase = await createClient()

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get verification status
  const { data: profile } = await supabase
    .from('profiles')
    .select('verification_status, full_name, submitted_at')
    .eq('id', user.id)
    .single()

  // Redirect if not pending
  if (profile?.verification_status === 'verified') {
    redirect('/dashboard')
  }

  if (profile?.verification_status === 'rejected') {
    redirect('/auth/verify-id/rejected')
  }

  if (profile?.verification_status === 'unverified') {
    redirect('/auth/verify-id')
  }

  // Format submission time
  const submittedDate = profile?.submitted_at
    ? new Date(profile.submitted_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Recently'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-10">
          <div className="text-center">
            {/* Success checkmark icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Pending
            </h1>

            <p className="text-gray-600 mb-4">
              Hi {profile?.full_name}, your student ID has been submitted successfully!
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-blue-800">
                <strong>Submitted:</strong> {submittedDate}
              </p>
              <p className="text-sm text-blue-800 mt-2">
                <strong>What happens next?</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-1 list-disc list-inside space-y-1">
                <li>Our admin team will review your ID within 24-48 hours</li>
                <li>You'll receive an email notification once reviewed</li>
                <li>After approval, you can access all marketplace features</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>⏰ Estimated review time:</strong> 24-48 hours
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                Please check your email ({user.email}) for updates.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/auth/verify-id/pending"
                className="block w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors text-center"
              >
                Refresh Status
              </Link>

              <Link
                href="/api/auth/signout"
                className="block w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center"
              >
                Logout
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              You will not be able to create listings or contact sellers until your ID is verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
