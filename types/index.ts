export interface Listing {
  id: string
  user_id: string
  title: string
  description: string
  price_etb: number
  category: 'Gear' | 'Gigs' | 'Jobs' | 'Freelance' | 'Courses' | 'Dorm Life' | 'Other'
  status: 'Active' | 'Sold'
  image_url: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Profile {
  id: string
  full_name: string
  campus_name: string
  telegram_handle: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
}

export type ActionResponse = {
  error?: string
  success?: boolean
}
