'use client'

import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { signUp } from "@/app/actions/auth-actions"
import { CAMPUS_OPTIONS } from "@/lib/utils"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Creating Account...' : 'Sign Up'}
    </button>
  )
}

export default function SignupForm() {
  const [state, formAction] = useActionState(signUp, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          CampusGebeya
        </h1>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Create Account
        </h2>

        {state?.error && (
          <div
            id="form-error"
            role="alert"
            aria-live="assertive"
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm"
          >
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4" aria-describedby={state?.error ? "form-error" : undefined}>
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="Your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="At least 6 characters"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="campus_name" className="block text-sm font-medium text-gray-700 mb-2">
              Campus *
            </label>
            <select
              id="campus_name"
              name="campus_name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              <option value="">Select your campus</option>
              {CAMPUS_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

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
                placeholder="username"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                pattern="[a-zA-Z0-9_]{5,32}"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              5-32 characters, letters, numbers, and underscores
            </p>
          </div>

          <SubmitButton />
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}
