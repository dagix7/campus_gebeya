'use client'

import { useEffect } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateProfile } from '@/app/actions/profile-actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CAMPUS_OPTIONS } from '@/lib/utils'
import type { Profile } from '@/types'

interface EditProfileFormProps {
  profile: Profile
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Saving...' : 'Save Changes'}
    </button>
  )
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(updateProfile, null)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    } else if (state?.success) {
      toast.success('Profile updated successfully!')
      router.push('/dashboard')
    }
  }, [state, router])

  return (
    <form action={formAction} className="bg-white rounded-lg shadow p-8 space-y-6">
      {/* Full Name */}
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          required
          defaultValue={profile.full_name}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., John Doe"
        />
      </div>

      {/* Campus */}
      <div>
        <label htmlFor="campus_name" className="block text-sm font-medium text-gray-700 mb-2">
          Campus *
        </label>
        <select
          id="campus_name"
          name="campus_name"
          required
          defaultValue={profile.campus_name}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {CAMPUS_OPTIONS.map((campus) => (
            <option key={campus} value={campus}>
              {campus}
            </option>
          ))}
        </select>
      </div>

      {/* Telegram Handle */}
      <div>
        <label htmlFor="telegram_handle" className="block text-sm font-medium text-gray-700 mb-2">
          Telegram Handle *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-2.5 text-gray-500">@</span>
          <input
            type="text"
            id="telegram_handle"
            name="telegram_handle"
            required
            defaultValue={profile.telegram_handle?.replace('@', '')}
            className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="username"
            pattern="[a-zA-Z0-9_]{5,32}"
            title="5-32 characters with only letters, numbers, and underscores"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          5-32 characters, letters, numbers, and underscores only
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <div className="flex-1">
          <SubmitButton />
        </div>
      </div>
    </form>
  )
}
