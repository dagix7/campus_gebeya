import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import VerifyIdForm from '@/components/verify-id-form'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verification Rejected | CampusGebeya',
  description: 'Your student ID submission was rejected - please resubmit',
}

export default async function RejectedPage() {
  const supabase = await createClient()

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get verification status
  const { data: profile } = await supabase
    .from('profiles')
    .select('verification_status, full_name, rejection_reason')
    .eq('id', user.id)
    .single()

  // Redirect if not rejected
  if (profile?.verification_status === 'verified') {
    redirect('/dashboard')
  }

  if (profile?.verification_status === 'pending') {
    redirect('/auth/verify-id/pending')
  }

  if (profile?.verification_status === 'unverified') {
    redirect('/auth/verify-id')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">
          Verification Rejected
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please review the feedback and resubmit your student ID
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-10">
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Rejection Reason:
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{profile?.rejection_reason || 'Your submission did not meet verification requirements.'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              📸 Tips for better photos:
            </h3>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Ensure good lighting (natural light works best)</li>
              <li>Make sure the university name is clearly visible</li>
              <li>Avoid shadows, glare, or reflections</li>
              <li>Keep the ID card flat (not curved)</li>
              <li>Focus the camera for sharp text</li>
              <li>Include the entire ID card in the photo</li>
            </ul>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Resubmit Your Student ID
          </h2>

          <VerifyIdForm />

          <div className="mt-6 text-center">
            <Link
              href="/api/auth/signout"
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
