-- ====================================
-- FIX: Categories Constraint + Admin Verification Bypass
-- ====================================
-- Run this in Supabase SQL Editor to fix:
-- 1. Allow all categories (not just Gear and Gigs)
-- 2. Allow admin users to create listings without verification

-- ====================================
-- 1. FIX CATEGORIES CONSTRAINT
-- ====================================

-- First, find and drop the existing category constraint
ALTER TABLE public.listings
DROP CONSTRAINT IF EXISTS listings_category_check;

-- Add the new constraint with ALL categories
ALTER TABLE public.listings
ADD CONSTRAINT listings_category_check
CHECK (category IN ('Gear', 'Gigs', 'Jobs', 'Freelance', 'Courses', 'Dorm Life', 'Other'));

-- ====================================
-- 2. UPDATE RLS POLICIES FOR ADMIN BYPASS
-- ====================================

-- Drop existing verification-required policies
DROP POLICY IF EXISTS "Verified users can insert listings" ON public.listings;
DROP POLICY IF EXISTS "Verified users can update own listings" ON public.listings;
DROP POLICY IF EXISTS "Verified users can delete own listings" ON public.listings;

-- Create new policies that allow verified users OR admins

-- INSERT: Verified users or admins can create listings
CREATE POLICY "Verified users or admins can insert listings"
  ON public.listings
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND (verification_status = 'verified' OR is_admin = TRUE)
    )
  );

-- UPDATE: Verified users or admins can update their own listings
CREATE POLICY "Verified users or admins can update own listings"
  ON public.listings
  FOR UPDATE
  USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND (verification_status = 'verified' OR is_admin = TRUE)
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND (verification_status = 'verified' OR is_admin = TRUE)
    )
  );

-- DELETE: Verified users or admins can delete their own listings
CREATE POLICY "Verified users or admins can delete own listings"
  ON public.listings
  FOR DELETE
  USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND (verification_status = 'verified' OR is_admin = TRUE)
    )
  );

-- ====================================
-- 3. VERIFY CHANGES
-- ====================================

-- Check the new constraint
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.listings'::regclass
AND conname LIKE '%category%';

-- Check the new policies
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'listings'
AND policyname LIKE '%Verified%' OR policyname LIKE '%admin%';
