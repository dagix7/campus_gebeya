-- CampusGebeya Database Schema

-- ====================================
-- 1. PROFILES TABLE (Update existing)
-- ====================================
-- Run this if the profiles table needs to be recreated or updated
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  campus_name text NOT NULL,
  telegram_handle text NOT NULL,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================
-- 2. LISTINGS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  price_etb integer NOT NULL,
  category text NOT NULL CHECK (category IN ('Gear', 'Gigs')),
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Sold')),
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS listings_user_id_idx ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS listings_category_idx ON public.listings(category);
CREATE INDEX IF NOT EXISTS listings_status_idx ON public.listings(status);
CREATE INDEX IF NOT EXISTS listings_created_at_idx ON public.listings(created_at DESC);

-- ====================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ====================================

-- Enable RLS on tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- ====================================
-- 4. PROFILES RLS POLICIES
-- ====================================

-- Allow public read access to profiles (needed for displaying seller info)
CREATE POLICY "Public read access to profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

-- ====================================
-- 5. LISTINGS RLS POLICIES
-- ====================================

-- Allow public read access to all active listings
CREATE POLICY "Public read active listings" 
  ON public.listings 
  FOR SELECT 
  USING (status = 'Active' OR auth.uid() = user_id);

-- Allow users to read their own listings (including sold ones)
CREATE POLICY "Users can read own listings" 
  ON public.listings 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert listings
CREATE POLICY "Users can insert listings" 
  ON public.listings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own listings
CREATE POLICY "Users can update own listings" 
  ON public.listings 
  FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own listings
CREATE POLICY "Users can delete own listings" 
  ON public.listings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ====================================
-- 6. STORAGE POLICIES (for listing-images bucket)
-- ====================================

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT DO NOTHING;

-- Allow public to read listing images
CREATE POLICY "Public read access" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'listing-images');

-- Allow authenticated users to upload images
CREATE POLICY "Users can upload images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'listing-images' AND auth.role() = 'authenticated');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'listing-images' AND auth.uid()::text = owner);

-- ====================================
-- 7. TRIGGERS FOR UPDATED_AT
-- ====================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for listings table
DROP TRIGGER IF EXISTS update_listings_updated_at ON public.listings;
CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON public.listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- 8. VERIFY SETUP
-- ====================================

-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'listings');

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'listings');
