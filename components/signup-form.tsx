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
      className="w-full bg-coffee-900 dark:bg-coffee-700 text-white py-4 rounded-xl font-bold hover:bg-coffee-800 dark:hover:bg-coffee-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-lg"
    >
      {pending ? 'Creating Account...' : 'Sign Up'}
    </button>
  )
}

export default function SignupForm() {
  const [state, formAction] = useActionState(signUp, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coffee-100 via-coffee-50 to-earth-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 w-full max-w-md border-2 border-gray-100 dark:border-gray-700">
        <h1 className="text-4xl font-bold text-center text-coffee-900 dark:text-coffee-400 mb-3 font-serif">
          CampusGebeya
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 font-medium">Join the marketplace!</p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Create Account
        </h2>

        {state?.error && (
          <div
            id="form-error"
            role="alert"
            aria-live="assertive"
            className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm font-medium"
          >
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4" aria-describedby={state?.error ? "form-error" : undefined}>
          <div>
            <label htmlFor="full_name" className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="Your full name"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-coffee-500 dark:focus:border-coffee-400 outline-none font-medium"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-coffee-500 dark:focus:border-coffee-400 outline-none font-medium"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-coffee-500 dark:focus:border-coffee-400 outline-none font-medium"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="campus_name" className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">
              Campus *
            </label>
            <select
              id="campus_name"
              name="campus_name"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-coffee-500 dark:focus:border-coffee-400 outline-none font-medium"
              required
            >
              <option value="">Select your campus</option>
              {CAMPUS_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="telegram_handle" className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">
              Telegram Handle *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-600 dark:text-gray-400 font-medium">@</span>
              <input
                type="text"
                id="telegram_handle"
                name="telegram_handle"
                placeholder="username"
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-coffee-500 dark:focus:border-coffee-400 outline-none font-medium"
                pattern="[a-zA-Z0-9_]{5,32}"
                required
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
              5-32 characters, letters, numbers, and underscores
            </p>
          </div>

          <SubmitButton />
        </form>

        <p className="text-center text-gray-700 dark:text-gray-400 mt-6 font-medium">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-coffee-800 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-coffee-300 font-bold">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}
