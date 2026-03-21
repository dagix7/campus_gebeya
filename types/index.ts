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
  // Verification fields
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
  student_id_url: string | null
  verified_at: string | null
  verified_university: 'AAU' | 'AASTU' | null
  rejection_reason: string | null
  submitted_at: string | null
  is_admin: boolean
  ocr_confidence: string | null
}

export interface VerificationLog {
  id: string
  user_id: string
  action: 'submitted' | 'approved' | 'rejected' | 'resubmitted'
  admin_id: string | null
  reason: string | null
  metadata: Record<string, any> | null
  created_at: string
}

export type OCRResult = {
  text: string
  confidence: 'match_found' | 'no_match' | 'uncertain'
  matchedPattern?: string
}

export interface User {
  id: string
  email: string
}

export type ActionResponse = {
  error?: string
  success?: boolean
}
