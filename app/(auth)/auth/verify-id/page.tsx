import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import VerifyIdForm from '@/components/verify-id-form'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Student ID | CampusGebeya',
  description: 'Upload your student ID for verification to access CampusGebeya marketplace',
}

export default async function VerifyIdPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
  const supabase = await createClient()

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get verification status
  const { data: profile } = await supabase
    .from('profiles')
    .select('verification_status, full_name')
    .eq('id', user.id)
    .single()

  // Redirect based on status
  if (profile?.verification_status === 'verified') {
    redirect('/dashboard')
  }

  if (profile?.verification_status === 'pending') {
    redirect('/auth/verify-id/pending')
  }

  if (profile?.verification_status === 'rejected') {
    redirect('/auth/verify-id/rejected')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">
          Verify Your Student ID
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Welcome, {profile?.full_name}!
        </p>
        <p className="mt-1 text-center text-sm text-gray-600">
          To access CampusGebeya marketplace, please upload your student ID card for verification.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-10">
          {searchParams?.message && (
            <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              {searchParams.message}
            </div>
          )}

          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
            <p className="font-medium">⚠ Verification Required</p>
            <p className="mt-1">
              Only students from <strong>Addis Ababa University (AAU)</strong> and <strong>Addis Ababa Science and Technology University (AASTU)</strong> can use this platform.
            </p>
          </div>

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
