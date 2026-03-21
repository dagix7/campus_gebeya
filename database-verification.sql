-- ====================================
-- ID VERIFICATION FEATURE MIGRATION
-- ====================================
-- This migration adds ID verification functionality to CampusGebeya
-- Run this in Supabase SQL Editor BEFORE deploying code changes

-- ====================================
-- 1. ADD VERIFICATION FIELDS TO PROFILES TABLE
-- ====================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified'
  CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS student_id_url TEXT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verified_university TEXT
  CHECK (verified_university IN ('AAU', 'AASTU')),
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ocr_confidence TEXT;

-- Create indexes for admin queries and performance
CREATE INDEX IF NOT EXISTS profiles_verification_status_idx
  ON public.profiles(verification_status);
CREATE INDEX IF NOT EXISTS profiles_submitted_at_idx
  ON public.profiles(submitted_at DESC);
CREATE INDEX IF NOT EXISTS profiles_is_admin_idx
  ON public.profiles(is_admin);

-- ====================================
-- 2. CREATE VERIFICATION_LOGS TABLE (Audit Trail)
-- ====================================

CREATE TABLE IF NOT EXISTS public.verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL
    CHECK (action IN ('submitted', 'approved', 'rejected', 'resubmitted')),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS verification_logs_user_id_idx
  ON public.verification_logs(user_id);
CREATE INDEX IF NOT EXISTS verification_logs_created_at_idx
  ON public.verification_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;

-- Admins can read all logs
CREATE POLICY "Admins can read all logs"
  ON public.verification_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Users can read their own logs
CREATE POLICY "Users can read own logs"
  ON public.verification_logs
  FOR SELECT
  USING (user_id = auth.uid());

-- ====================================
-- 3. CREATE PRIVATE STORAGE BUCKET FOR STUDENT IDs
-- ====================================

-- Create private bucket (not public like listing-images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-documents', 'verification-documents', false)
ON CONFLICT DO NOTHING;

-- Users can upload their own ID (folder structure: {user_id}/filename)
CREATE POLICY "Users can upload own ID"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'verification-documents'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can read their own ID
CREATE POLICY "Users can read own ID"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'verification-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can read all IDs
CREATE POLICY "Admins can read all IDs"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'verification-documents'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Users can delete their own rejected submissions (for resubmission)
CREATE POLICY "Users can delete own ID"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'verification-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ====================================
-- 4. UPDATE LISTINGS RLS POLICIES (Verification Required)
-- ====================================

-- Drop old policies
DROP POLICY IF EXISTS "Users can insert listings" ON public.listings;
DROP POLICY IF EXISTS "Users can update own listings" ON public.listings;
DROP POLICY IF EXISTS "Users can delete own listings" ON public.listings;

-- Create new policies that require verification
CREATE POLICY "Verified users can insert listings"
  ON public.listings
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND verification_status = 'verified'
    )
  );

CREATE POLICY "Verified users can update own listings"
  ON public.listings
  FOR UPDATE
  USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND verification_status = 'verified'
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND verification_status = 'verified'
    )
  );

CREATE POLICY "Verified users can delete own listings"
  ON public.listings
  FOR DELETE
  USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND verification_status = 'verified'
    )
  );

-- ====================================
-- 5. SEED FIRST ADMIN (Replace with your email)
-- ====================================

-- IMPORTANT: Replace 'your-admin-email@example.com' with your actual email address
-- after running this migration
/*
UPDATE public.profiles
SET is_admin = TRUE
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com'
);
*/

-- ====================================
-- 6. VERIFY MIGRATION SUCCESS
-- ====================================

-- Check verification fields added to profiles
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN (
    'verification_status', 'student_id_url', 'verified_at',
    'verified_university', 'rejection_reason', 'submitted_at',
    'is_admin', 'ocr_confidence'
  );

-- Check verification_logs table created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'verification_logs';

-- Check indexes created
SELECT indexname FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'verification_logs')
  AND indexname LIKE '%verification%' OR indexname LIKE '%admin%';

-- Check storage bucket created
SELECT id, name, public FROM storage.buckets WHERE name = 'verification-documents';

-- Check RLS policies
SELECT tablename, policyname FROM pg_policies
WHERE schemaname = 'public'
  AND (tablename = 'verification_logs' OR policyname LIKE '%Verified%');
