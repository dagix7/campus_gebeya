import { getVerificationDetails, getStudentIdUrl } from '@/app/actions/admin-actions'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ReviewForm from '@/components/admin-review-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Review Verification | Admin | CampusGebeya',
  description: 'Review student ID verification submission',
}

export default async function ReviewVerificationPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  // Get verification details
  const { profile, logs } = await getVerificationDetails(userId)

  if (!profile) {
    notFound()
  }

  // If not pending, redirect back to queue
  if (profile.verification_status !== 'pending') {
    redirect('/admin/verifications')
  }

  // Get signed URL for student ID image
  const studentIdUrl = await getStudentIdUrl(userId)

  // Format submission time
  const submittedTime = profile.submitted_at
    ? new Date(profile.submitted_at).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Unknown'

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/verifications"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Queue
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Student Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Student Information
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{profile.full_name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Campus</label>
                <p className="text-gray-900">{profile.campus_name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Telegram Handle</label>
                <p className="text-gray-900">{profile.telegram_handle}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-700 text-sm break-all">{userId}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Submitted</label>
                <p className="text-gray-900">{submittedTime}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">OCR Result</label>
                <span
                  className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full ${
                    profile.ocr_confidence === 'match_found'
                      ? 'bg-green-100 text-green-800'
                      : profile.ocr_confidence === 'uncertain'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {profile.ocr_confidence === 'match_found'
                    ? '✓ University Match Found'
                    : profile.ocr_confidence === 'uncertain'
                    ? '⚠ Uncertain - Manual Review'
                    : 'No OCR Data'}
                </span>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Review Decision
            </h2>
            <ReviewForm userId={userId} campusName={profile.campus_name} />
          </div>

          {/* Verification History */}
          {logs.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Verification History
              </h2>
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="text-sm border-l-2 border-gray-300 pl-3 py-1"
                  >
                    <span className="font-medium capitalize">{log.action}</span>
                    {log.reason && (
                      <span className="text-gray-600"> - {log.reason}</span>
                    )}
                    <p className="text-gray-500 text-xs">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Student ID Image */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Student ID Card
          </h2>

          {studentIdUrl ? (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <img
                src={studentIdUrl}
                alt="Student ID"
                className="w-full h-auto"
              />
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-12 text-center bg-gray-50">
              <p className="text-gray-500">No image available</p>
            </div>
          )}

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              ✓ Verification Checklist:
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
              <li>University name clearly visible (AAU or AASTU)?</li>
              <li>Photo matches student information?</li>
              <li>ID appears legitimate (not fake or altered)?</li>
              <li>Image quality sufficient for verification?</li>
            </ul>
          </div>

          {studentIdUrl && (
            <a
              href={studentIdUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Open in New Tab →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
