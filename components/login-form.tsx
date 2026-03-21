'use client'

import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { signIn } from "@/app/actions/auth-actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-coffee-900 dark:bg-coffee-700 text-white py-4 rounded-xl font-bold hover:bg-coffee-800 dark:hover:bg-coffee-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-lg"
    >
      {pending ? 'Logging in...' : 'Log In'}
    </button>
  )
}

export default function LoginForm() {
  const [state, formAction] = useActionState(signIn, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coffee-100 via-coffee-50 to-earth-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 w-full max-w-md border-2 border-gray-100 dark:border-gray-700">
        <h1 className="text-4xl font-bold text-center text-coffee-900 dark:text-coffee-400 mb-3 font-serif">
          CampusGebeya
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 font-medium">Welcome back!</p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Log In
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

        <form action={formAction} className="space-y-5" aria-describedby={state?.error ? "form-error" : undefined}>
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-coffee-500 dark:focus:border-coffee-400 outline-none font-medium"
              required
              aria-invalid={state?.error ? "true" : undefined}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-800 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Your password"
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-coffee-500 dark:focus:ring-coffee-400 focus:border-coffee-500 dark:focus:border-coffee-400 outline-none font-medium"
              required
              aria-invalid={state?.error ? "true" : undefined}
            />
          </div>

          <SubmitButton />
        </form>

        <p className="text-center text-gray-700 dark:text-gray-400 mt-6 font-medium">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-coffee-800 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-coffee-300 font-bold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
