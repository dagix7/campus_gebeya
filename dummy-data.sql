-- CampusGebeya Dummy Data Script
-- This script adds sample listings to populate the marketplace

-- IMPORTANT: Before running this script:
-- 1. Create at least 3 test user accounts by signing up through the UI at /auth/signup
-- 2. Log into Supabase Dashboard → Authentication → Users
-- 3. Copy the User IDs (UUID format) for 3 different users
-- 4. Replace {USER_ID_1}, {USER_ID_2}, {USER_ID_3} below with actual UUIDs
-- 5. Run this script in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Example:
-- Replace {USER_ID_1} with something like: '123e4567-e89b-12d3-a456-426614174000'

-- =============================================================================
-- DUMMY LISTINGS FOR GEAR CATEGORY
-- =============================================================================

INSERT INTO public.listings (user_id, title, description, price_etb, category, status, image_url) VALUES
(
  '{USER_ID_1}',
  'MacBook Pro 2020 - 13 inch M1',
  'Excellent condition MacBook Pro with M1 chip, 8GB RAM, 256GB SSD. Barely used, comes with original charger and box. Perfect for CS students running heavy IDEs and virtual machines. Battery health at 92%. No scratches or dents.',
  45000,
  'Gear',
  'Active',
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
),
(
  '{USER_ID_1}',
  'Calculus Textbook Bundle - Stewart',
  'Complete set of Calculus textbooks by James Stewart (Volumes I, II, III) with solutions manual. Great condition, minimal highlighting, no torn pages. Perfect for engineering and mathematics students. Includes practice problem sets.',
  1200,
  'Gear',
  'Active',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'
),
(
  '{USER_ID_2}',
  'iPhone 13 Pro - 128GB Pacific Blue',
  'iPhone 13 Pro in Pacific Blue color, 128GB storage. Condition 9/10, no scratches on screen or body. Battery health 95%. Comes with protective case and tempered glass screen protector. Original box and accessories included.',
  38000,
  'Gear',
  'Active',
  'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800'
),
(
  '{USER_ID_2}',
  'Engineering Calculator TI-84 Plus CE',
  'Texas Instruments TI-84 Plus CE graphing calculator. Perfect for engineering, physics, and advanced math courses. Barely used, like new condition. Includes USB charging cable and user manual.',
  800,
  'Gear',
  'Sold',
  'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800'
),
(
  '{USER_ID_3}',
  'Wooden Study Desk with Ergonomic Chair',
  'Solid wood study desk (120cm x 60cm) with matching ergonomic chair. Great condition, sturdy and stable. Perfect for dorm room or apartment. Has built-in cable management. Pickup only from AAU 6-Kilo campus area.',
  2500,
  'Gear',
  'Active',
  'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800'
),
(
  '{USER_ID_3}',
  'Sony WH-1000XM4 Noise Cancelling Headphones',
  'Premium wireless noise-cancelling headphones. Excellent for studying in loud environments or commuting. Battery lasts 30+ hours. Comes with carrying case, cables, and airplane adapter. Minor wear on ear cushions.',
  8500,
  'Gear',
  'Active',
  'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800'
),
(
  '{USER_ID_1}',
  'Mini Fridge - Perfect for Dorm Rooms',
  'Compact refrigerator, 1.7 cubic feet capacity. Perfect for dorm rooms and small apartments. Works perfectly, keeps drinks cold and snacks fresh. Energy efficient. White color. Pickup only from BiT campus area.',
  3000,
  'Gear',
  'Active',
  'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800'
);

-- =============================================================================
-- DUMMY LISTINGS FOR GIGS CATEGORY
-- =============================================================================

INSERT INTO public.listings (user_id, title, description, price_etb, category, status, image_url) VALUES
(
  '{USER_ID_2}',
  'Math Tutoring - Calculus & Linear Algebra',
  'Experienced math tutor (4th year Engineering student) offering tutoring for Calculus I/II/III and Linear Algebra. Flexible schedule, can meet at campus library or conduct online sessions via Zoom. Proven track record of helping students improve grades.',
  300,
  'Gigs',
  'Active',
  'https://images.unsplash.com/photo-1509869175650-a1d97972541a?w=800'
),
(
  '{USER_ID_3}',
  'Graphic Design Services - Logos & Posters',
  'Professional graphic design for event posters, social media content, logos, and business cards. Fast turnaround (24-48 hours). Portfolio available upon request. Experienced with Adobe Illustrator and Photoshop. Student discounts available.',
  500,
  'Gigs',
  'Active',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800'
),
(
  '{USER_ID_1}',
  'Programming Tutor - Python & JavaScript',
  'CS student offering programming lessons for beginners and intermediate learners. Specializing in Python, JavaScript, React, and web development fundamentals. Patient teaching style with real-world project examples. Beginners welcome!',
  400,
  'Gigs',
  'Active',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800'
),
(
  '{USER_ID_2}',
  'Essay Proofreading & Editing Service',
  'Native English speaker offering professional proofreading and editing services for essays, research papers, and assignments. Quick turnaround guaranteed (usually same day). Grammar, punctuation, clarity, and structure improvements included.',
  250,
  'Gigs',
  'Active',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800'
),
(
  '{USER_ID_3}',
  'Event Photography - Birthdays & Graduations',
  'Available for event photography including birthdays, campus events, graduations, and small parties. Professional DSLR camera and editing software. Packages start at 1500 ETB for 2-hour coverage with edited photos delivered within 5 days.',
  1500,
  'Gigs',
  'Active',
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800'
),
(
  '{USER_ID_1}',
  'Amharic-English Translation Services',
  'Fluent in both Amharic and English. Available for document translation, interpretation, and language tutoring. Experience with academic documents, business materials, and personal documents. Fast and accurate translations with cultural context.',
  200,
  'Gigs',
  'Active',
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800'
),
(
  '{USER_ID_2}',
  'Web Development - Portfolio & Business Sites',
  'Build your personal portfolio or small business website. Responsive design, modern UI, fast loading times. Experienced with React, Next.js, and WordPress. Affordable student rates. Includes basic SEO optimization and mobile responsiveness.',
  5000,
  'Gigs',
  'Active',
  'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800'
),
(
  '{USER_ID_3}',
  'Laundry Service - Campus Pick-up & Delivery',
  'Professional wash, dry, and fold laundry service. Pick up and deliver directly to your dorm or apartment on campus. Same-day service available for urgent needs. Eco-friendly detergent used. Minimum order 5kg. Weekly subscription discounts available.',
  150,
  'Gigs',
  'Active',
  'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800'
);

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- After running the script, verify the data was inserted correctly:

-- Check total number of listings created
SELECT COUNT(*) as total_listings FROM public.listings;

-- Check listings by category
SELECT category, COUNT(*) as count FROM public.listings GROUP BY category;

-- Check listings by status
SELECT status, COUNT(*) as count FROM public.listings GROUP BY status;

-- View all listings with basic info
SELECT title, category, price_etb, status FROM public.listings ORDER BY created_at DESC;

-- =============================================================================
-- NOTES
-- =============================================================================

-- This script creates:
-- - 7 Gear listings (6 Active, 1 Sold)
-- - 8 Gigs listings (all Active)
-- - Total: 15 listings
-- - Price range: 150 ETB to 45,000 ETB
-- - Uses Unsplash images as placeholders
-- - Realistic descriptions for Ethiopian student marketplace

-- To delete all dummy data (if needed):
-- DELETE FROM public.listings WHERE image_url LIKE '%unsplash%';
