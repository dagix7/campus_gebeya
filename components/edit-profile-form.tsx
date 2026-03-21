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
      className="w-full bg-coffee-900 dark:bg-coffee-700 text-white py-3 rounded-lg font-semibold hover:bg-coffee-800 dark:hover:bg-coffee-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
    <form action={formAction} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-coffee-200 dark:border-gray-700 p-8 md:p-10 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 space-y-6">
      {/* Decorative top bar */}
      <div className="flex gap-2 mb-4 pb-6 border-b-2 border-coffee-100 dark:border-gray-700">
        <div className="w-3 h-3 rounded-full bg-coffee-900" />
        <div className="w-3 h-3 rounded-full bg-earth-400" />
        <div className="w-3 h-3 rounded-full bg-coffee-700" />
      </div>
      {/* Full Name */}
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          required
          defaultValue={profile.full_name}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-transparent outline-none"
          placeholder="e.g., John Doe"
        />
      </div>

      {/* Campus */}
      <div>
        <label htmlFor="campus_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Campus *
        </label>
        <select
          id="campus_name"
          name="campus_name"
          required
          defaultValue={profile.campus_name}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-transparent outline-none"
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
        <label htmlFor="telegram_handle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Telegram Handle *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-2.5 text-gray-500 dark:text-gray-400">@</span>
          <input
            type="text"
            id="telegram_handle"
            name="telegram_handle"
            required
            defaultValue={profile.telegram_handle?.replace('@', '')}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-transparent outline-none"
            placeholder="username"
            pattern="[a-zA-Z0-9_]{5,32}"
            title="5-32 characters with only letters, numbers, and underscores"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          5-32 characters, letters, numbers, and underscores only
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
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
