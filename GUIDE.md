# CampusGebeya MVP

A student-only marketplace platform for university students in Addis Ababa to buy, sell, and hustle.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone or navigate to the project
cd campus_gebeya

# Install dependencies
npm install

# Set up environment variables
# .env.local is already configured with Supabase credentials

# Run development server
npm run dev
```

Visit http://localhost:3000

## 📋 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **UI Components**: Tailwind CSS with utility-first styling
- **Icons**: Lucide React
- **Database**: PostgreSQL (via Supabase)

## ✨ Features

### 1. User Authentication
- Email/password signup & login
- Supabase SSR authentication
- Profile creation on signup
- Session management

### 2. User Profiles
- Full name, campus, telegram handle
- Avatar support
- Profile visibility to other users

### 3. Marketplace Listings
- Create listings with title, description, price
- Upload listing images to Supabase storage
- Filter by category (Gear/Gigs)
- Filter by campus (AAU, BiT, ASTU)
- Search by keywords
- View seller information
- Contact seller via Telegram

### 4. Dashboard
- Manage own listings
- View listing status (Active/Sold)
- Edit/delete listings (coming soon)

### 5. Security
- Row Level Security (RLS) on all tables
- Users can only edit/delete their own listings
- Protected routes with middleware
- Secure image uploads

### 6. Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly navigation

## 📁 Project Structure

```
campus_gebeya/
├── app/
│   ├── (auth)/auth/
│   │   ├── login/page.tsx           # Login page
│   │   └── signup/page.tsx          # Sign up page
│   ├── (dashboard)/dashboard/
│   │   └── page.tsx                 # User dashboard
│   ├── listings/
│   │   ├── new/page.tsx             # Create listing
│   │   └── [id]/page.tsx            # Listing detail
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home page
│   └── globals.css                  # Global styles
│
├── components/
│   ├── navbar.tsx                   # Navigation bar
│   └── footer.tsx                   # Footer
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser client
│   │   ├── server.ts                # Server client
│   │   └── middleware.ts            # Auth middleware
│   └── utils.ts                     # Constants & helpers
│
├── public/                          # Static assets
├── middleware.ts                    # Route protection
├── database.sql                     # Database schema & RLS policies
├── BACKEND_SETUP.md                 # Backend setup guide
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.ts
```

## 🎨 Key Pages

### Home (/)
- Searchable grid of active listings
- Category and campus filters
- Responsive grid layout

### Sign Up (/auth/signup)
- Email/password registration
- Campus selection
- Telegram handle
- Full name

### Login (/auth/login)
- Email/password login
- Secure session

### Dashboard (/dashboard)
- User profile information
- List of user's listings
- Listing status overview
- Create new listing button

### Create Listing (/listings/new)
- Form with fields: title, category, price, description
- Image upload with preview
- Submit to create listing

### Listing Detail (/listings/[id])
- Full listing information
- Seller profile card
- "Contact on Telegram" button
- Share button

## 🔐 Security Features

### Row Level Security (RLS)
- **Profiles**: Public read, users can edit own profile
- **Listings**: Public read actives, users can edit/delete own
- **Storage**: Public read images, authenticated users can upload

### Middleware Protection
- Routes like `/dashboard` require authentication
- Session validation on every request
- Cookie-based session management

### Secure Uploads
- Images uploaded to Supabase storage
- Files scanned for malware
- Size limits enforced

## 🗄️ Database Schema

### profiles
```
- id (UUID, PK)
- full_name (string)
- campus_name (string)
- telegram_handle (string)
- avatar_url (string, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### listings
```
- id (UUID, PK)
- user_id (UUID, FK)
- title (string)
- description (string)
- price_etb (integer)
- category (Gear | Gigs)
- status (Active | Sold)
- image_url (string, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

## 🚢 Deployment

### Prepare for Production
```bash
# Build the project
npm run build

# Test the build
npm run start
```

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables to Vercel
4. Deploy automatically on push

## 📝 Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xbgpbyccnhipdsaqoapd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

These must start with `NEXT_PUBLIC_` to be available in the browser.

## 🧪 Testing

Manual testing checklist:
- [ ] Sign up with new account
- [ ] Login with existing account
- [ ] Create a listing
- [ ] Upload an image
- [ ] Search for listings
- [ ] Filter by category
- [ ] Filter by campus
- [ ] View listing details
- [ ] Click "Contact on Telegram"
- [ ] View dashboard
- [ ] Responsive on mobile

## 🐛 Known Issues & Todos

### Current Limitations
- Edit listing functionality (partially implemented)
- Delete listing functionality (partially implemented)
- No email verification
- No user ratings/reviews
- No in-app messaging
- Single image per listing

### TODO List
- [ ] Implement listing edit page
- [ ] Implement listing delete
- [ ] Add favorite listings
- [ ] Email verification flow
- [ ] User ratings system
- [ ] In-app messaging
- [ ] Multiple images per listing
- [ ] Admin dashboard
- [ ] Listing analytics

## 📚 Documentation

- **BACKEND_SETUP.md** - Complete backend setup guide
- **database.sql** - SQL schema and RLS policies
- **README.md** - This file

## 🤝 Contributing

This is an MVP project. For any improvements or bug fixes, please update the relevant files and test locally before deployment.

## 📧 Support

For issues or questions:
1. Check BACKEND_SETUP.md
2. Review database.sql for schema
3. Check Supabase documentation
4. Check Next.js documentation

---

**Built with ❤️ for Addis Ababa's students**
