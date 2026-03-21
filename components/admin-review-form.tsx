'use client'

import { useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { approveVerification, rejectVerification } from '@/app/actions/admin-actions'
import { useRouter } from 'next/navigation'

function ActionButtons() {
  const { pending } = useFormStatus()

  return (
    <div className="flex space-x-3">
      <button
        type="submit"
        name="action"
        value="approve"
        disabled={pending}
        className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? 'Processing...' : 'Approve'}
      </button>
      <button
        type="submit"
        name="action"
        value="reject"
        disabled={pending}
        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? 'Processing...' : 'Reject'}
      </button>
    </div>
  )
}

interface ReviewFormProps {
  userId: string
  campusName: string
}

export default function ReviewForm({ userId, campusName }: ReviewFormProps) {
  const router = useRouter()
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleFormAction = async (formData: FormData) => {
    const action = formData.get('action')

    if (action === 'approve') {
      const university = formData.get('university') as 'AAU' | 'AASTU'

      const result = await approveVerification(userId, university)

      if (result.success) {
        alert('Verification approved successfully!')
        router.push('/admin/verifications')
        router.refresh()
      } else {
        alert(`Error: ${result.error}`)
      }
    } else if (action === 'reject') {
      const reason = formData.get('reason') as string

      if (!reason || reason.trim().length < 10) {
        alert('Please provide a detailed rejection reason (at least 10 characters)')
        return
      }

      const result = await rejectVerification(userId, reason)

      if (result.success) {
        alert('Verification rejected. User can resubmit.')
        router.push('/admin/verifications')
        router.refresh()
      } else {
        alert(`Error: ${result.error}`)
      }
    }
  }

  return (
    <form action={handleFormAction} className="space-y-6">
      {/* University Selection for Approval */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select University
        </label>
        <select
          name="university"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue={campusName === 'AAU' ? 'AAU' : campusName === 'AASTU' ? 'AASTU' : ''}
        >
          <option value="">Choose university...</option>
          <option value="AAU">Addis Ababa University (AAU)</option>
          <option value="AASTU">Addis Ababa Science and Technology University (AASTU)</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Verify which university the student belongs to based on their ID.
        </p>
      </div>

      {/* Rejection Reason (shown when rejecting) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rejection Reason (if rejecting)
        </label>
        <textarea
          name="reason"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          rows={4}
          placeholder="E.g., Image is too blurry, university name not visible, ID appears fake, etc."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Be specific so the user knows what to fix when resubmitting.
        </p>
      </div>

      <ActionButtons />
    </form>
  )
}
