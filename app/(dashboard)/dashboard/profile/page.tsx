import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EditProfileForm from '@/components/edit-profile-form'
import type { Profile } from '@/types'

export default async function EditProfilePage() {
  const supabase = await createClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // Get profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-100 via-earth-100/50 to-coffee-50 dark:bg-gray-900 relative overflow-hidden py-12">
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-coffee-200/30 dark:bg-coffee-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-earth-200/40 dark:bg-earth-900/20 rounded-full blur-3xl" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block bg-coffee-900 dark:bg-coffee-700 text-white px-6 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
            👤 Profile Settings
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">Edit Your Profile</h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg">Update your information</p>
        </div>
        <EditProfileForm profile={profile as Profile} />
      </div>
    </div>
  )
}
