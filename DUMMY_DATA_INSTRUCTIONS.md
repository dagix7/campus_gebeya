# CampusGebeya Dummy Data Setup Instructions

This guide will help you populate your CampusGebeya database with sample listings.

## Prerequisites

- Supabase project set up and running
- Database tables created (profiles, listings)
- Environment variables configured

## Step-by-Step Instructions

### 1. Create Test User Accounts

First, you need to create at least 3 test user accounts:

1. Navigate to your app: `http://localhost:3000/auth/signup`
2. Create 3 different user accounts with these sample details:

**User 1 - Engineering Student:**
- Email: `student1@test.com`
- Password: `password123`
- Full Name: `Abebe Kebede`
- Campus: `AAU 4-Kilo`
- Telegram: `@abebekebede`

**User 2 - CS Student:**
- Email: `student2@test.com`
- Password: `password123`
- Full Name: `Meron Tadesse`
- Campus: `AAU 6-Kilo`
- Telegram: `@merontadesse`

**User 3 - BiT Student:**
- Email: `student3@test.com`
- Password: `password123`
- Full Name: `Daniel Haile`
- Campus: `BiT`
- Telegram: `@danielhaile`

### 2. Get User IDs from Supabase

1. Open your Supabase Dashboard: `https://supabase.com/dashboard`
2. Select your project
3. Navigate to **Authentication** → **Users**
4. You'll see your 3 newly created users
5. Copy the **UUID** for each user (it looks like: `123e4567-e89b-12d3-a456-426614174000`)

### 3. Update the SQL Script

1. Open the file: `dummy-data.sql`
2. Find and replace all instances of:
   - `{USER_ID_1}` with the UUID of User 1
   - `{USER_ID_2}` with the UUID of User 2
   - `{USER_ID_3}` with the UUID of User 3

Example:
```sql
-- Before:
'{USER_ID_1}',

-- After (using actual UUID):
'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
```

### 4. Run the SQL Script

1. In Supabase Dashboard, navigate to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `dummy-data.sql` (with your updated UUIDs)
4. Paste into the SQL Editor
5. Click **Run** or press `Ctrl+Enter`

### 5. Verify the Data

After running the script, verify it worked:

1. In the SQL Editor, run:
   ```sql
   SELECT COUNT(*) FROM public.listings;
   ```
   Should return: **15 listings**

2. Check the home page of your app: `http://localhost:3000`
   You should see 15 listings (14 Active, 1 Sold)

## What Gets Created

The dummy data script creates:

### Gear Category (7 listings):
1. MacBook Pro 2020 - 45,000 ETB (Active)
2. Calculus Textbook Bundle - 1,200 ETB (Active)
3. iPhone 13 Pro - 38,000 ETB (Active)
4. Engineering Calculator TI-84 - 800 ETB (**Sold**)
5. Study Desk with Chair - 2,500 ETB (Active)
6. Sony Headphones - 8,500 ETB (Active)
7. Mini Fridge - 3,000 ETB (Active)

### Gigs Category (8 listings):
1. Math Tutoring - 300 ETB (Active)
2. Graphic Design Services - 500 ETB (Active)
3. Programming Tutor - 400 ETB (Active)
4. Essay Proofreading - 250 ETB (Active)
5. Event Photography - 1,500 ETB (Active)
6. Translation Services - 200 ETB (Active)
7. Web Development - 5,000 ETB (Active)
8. Laundry Service - 150 ETB (Active)

## Testing Features

With the dummy data in place, you can now test:

- ✅ Browse listings on home page
- ✅ Filter by category (Gear/Gigs)
- ✅ Search listings by keywords
- ✅ View listing details
- ✅ See seller information
- ✅ Contact seller via Telegram
- ✅ Share listings
- ✅ Log in as different users
- ✅ View dashboard with listings
- ✅ Edit your own listings
- ✅ Delete your own listings
- ✅ Mark listings as sold

## Troubleshooting

### "0 listings created" after running SQL

**Problem**: The script ran but no listings appear.

**Solution**:
- Make sure you replaced ALL instances of `{USER_ID_1}`, `{USER_ID_2}`, `{USER_ID_3}`
- Verify the UUIDs are correct and match users in `auth.users` table
- Check that RLS policies allow listing creation

### "Foreign key violation" error

**Problem**: SQL fails with foreign key constraint error.

**Solution**:
- Ensure the user IDs you're using exist in the `auth.users` table
- Make sure profiles were created for these users (should happen automatically on signup)

### Images not showing

**Problem**: Listings display but images are broken.

**Solution**:
- Check that `next.config.ts` includes Unsplash in the `remotePatterns`
- Verify your internet connection (images are from Unsplash CDN)
- Check browser console for CORS or image loading errors

## Cleanup

To remove all dummy data:

```sql
-- Delete all listings with Unsplash images
DELETE FROM public.listings WHERE image_url LIKE '%unsplash%';
```

## Next Steps

After setting up dummy data:

1. Create your own listing through the UI
2. Test editing and deleting listings
3. Test the search and filter functionality
4. Try different user accounts to verify RLS policies
5. Test the Telegram contact links

---

**Need Help?** Check the main README.md or BACKEND_SETUP.md for more information.
