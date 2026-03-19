# CampusGebeya Backend Setup Guide

## Overview
This guide walks through setting up the CampusGebeya MVP with Supabase as the backend.

## Prerequisites
- Supabase account (already created)
- Supabase URL and API keys (already in `.env.local`)
- Next.js 16 project initialized

## Setup Steps

### 1. Database Schema Setup

**Run the SQL in Supabase Dashboard:**

1. Go to https://supabase.com/dashboard/project/xbgpbyccnhipdsaqoapd
2. Navigate to SQL Editor
3. Click "New Query"
4. Copy and paste the entire contents of `database.sql`
5. Click "Run"

This will create:
- `profiles` table (for user profiles)
- `listings` table (for marketplace items)
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for `updated_at` timestamps

### 2. Storage Setup

**Create the listing-images bucket:**

1. Go to Storage section
2. Click "New bucket"
3. Name: `listing-images`
4. Make it public
5. Click Create

The SQL script already configures storage policies.

### 3. Environment Variables

Your `.env.local` should have:
```
NEXT_PUBLIC_SUPABASE_URL=https://xbgpbyccnhipdsaqoapd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Install Dependencies

All required packages are installed:
- `@supabase/ssr` - Server-side auth
- `@supabase/supabase-js` - Database client
- `lucide-react` - Icons
- `tailwind-merge` & `clsx` - Utility classes

### 5. Run the Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
app/
├── (auth)/                 # Auth layout group
│   └── auth/
│       ├── login/         # Login page
│       └── signup/        # Sign up page
├── (dashboard)/           # Dashboard layout group
│   └── dashboard/         # User dashboard
├── listings/
│   ├── new/              # Create listing form
│   └── [id]/             # Listing detail page
├── page.tsx              # Home page (searchable grid)
└── layout.tsx            # Root layout

components/
├── navbar.tsx            # Navigation bar
└── footer.tsx            # Footer

lib/
├── supabase/
│   ├── client.ts         # Browser-side Supabase client
│   ├── server.ts         # Server-side Supabase client
│   └── middleware.ts     # Auth middleware utility
└── utils.ts              # Helper functions & constants

middleware.ts            # Route protection middleware
```

## Key Features

### Authentication
- Email/password signup
- User profile creation on signup
- Session persistence via cookies
- Middleware-based route protection

### Marketplace
- Create listings with image upload
- Filter by category (Gear/Gigs) and campus
- Search listings by title/description
- View seller information
- Contact seller via Telegram

### Security (RLS Policies)
- Users can only see active listings (or their own)
- Users can only edit/delete their own listings
- Public can view seller profiles
- Image uploads secured by bucket policies

### UI/UX
- Mobile-first responsive design
- Tailwind CSS styling
- Lucide React icons
- Smooth transitions and hover states

## Database Schema

### profiles Table
```javascript
{
  id: UUID (Primary Key, references auth.users)
  full_name: string (required)
  campus_name: string (required, one of: "AAU 4-Kilo", "AAU 5-Kilo", "AAU 6-Kilo", "BiT", "ASTU")
  telegram_handle: string (required)
  avatar_url: string (optional)
  created_at: timestamp
  updated_at: timestamp
}
```

### listings Table
```javascript
{
  id: UUID (Primary Key)
  user_id: UUID (Foreign Key → profiles.id)
  title: string (required)
  description: string (required)
  price_etb: integer (required)
  category: string (required, one of: "Gear", "Gigs")
  status: string (default: "Active", one of: "Active", "Sold")
  image_url: string (optional)
  created_at: timestamp
  updated_at: timestamp
}
```

## API Routes & Server Actions

All database operations use Next.js with Supabase client:

- **GET /**: Home page with searchable listings
- **GET /auth/login**: Login form
- **GET /auth/signup**: Signup form (creates profile on submit)
- **GET /dashboard**: User's listings and profile
- **GET /listings/new**: Create listing form
- **GET /listings/[id]**: Listing detail page
- **POST** (form action): Create listing with image upload

## Middleware Protection

Routes protected by `middleware.ts`:
- `/dashboard` - Requires authentication
- `/listings/new` - Requires authentication
- `/listings/[id]/edit` - (Not yet implemented, add path to middleware matcher)

## Testing Checklist

- [ ] Run `npm run dev`
- [ ] Visit http://localhost:3000
- [ ] Sign up with email
- [ ] Verify profile created
- [ ] Create a listing with image
- [ ] Search/filter listings
- [ ] View listing details
- [ ] Contact seller via Telegram link
- [ ] Dashboard shows own listings

## Next Steps (Future Enhancements)

1. **Edit Listing** - Allow users to edit their listings
2. **Delete Listing** - Allow users to delete listings
3. **Favorites** - Save favorite listings
4. **Reviews/Ratings** - Rate sellers
5. **Messages** - In-app messaging system
6. **Email Verification** - Verify user emails
7. **Profile Completion** - Profile progress indicator
8. **Image Gallery** - Multiple images per listing
9. **Advanced Filters** - Price range, date, etc.
10. **Analytics** - Track views, searches, sales

## Troubleshooting

### "User not authenticated" error
- Ensure user is logged in
- Check cookies are being saved
- Clear browser cookies and login again

### Images not uploading
- Verify `listing-images` bucket exists
- Check storage policies in Supabase
- Ensure file size < 10MB

### Database errors
- Run the SQL script again from database.sql
- Check RLS policies are correctly applied
- Verify user_id matches auth.users

## Support
For any issues, check:
1. Supabase documentation: https://supabase.com/docs
2. Next.js documentation: https://nextjs.org/docs
3. Project local logs in terminal
