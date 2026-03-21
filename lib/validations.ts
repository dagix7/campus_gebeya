import { z } from 'zod'

// Listing validation schemas
export const listingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must not exceed 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description must not exceed 1000 characters'),
  price_etb: z.number().min(1, 'Price must be at least 1 ETB').max(1000000, 'Price must not exceed 1,000,000 ETB'),
  category: z.enum(['Gear', 'Gigs', 'Jobs', 'Freelance', 'Courses', 'Dorm Life', 'Other']),
  image: z.instanceof(File).refine(file => file.size <= 10 * 1024 * 1024, 'Image must be less than 10MB')
    .refine(file => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type), 'Image must be JPEG, PNG, or WebP'),
})

export const updateListingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must not exceed 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description must not exceed 1000 characters'),
  price_etb: z.number().min(1, 'Price must be at least 1 ETB').max(1000000, 'Price must not exceed 1,000,000 ETB'),
  category: z.enum(['Gear', 'Gigs', 'Jobs', 'Freelance', 'Courses', 'Dorm Life', 'Other']),
  image: z.instanceof(File).refine(file => file.size <= 10 * 1024 * 1024, 'Image must be less than 10MB')
    .refine(file => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type), 'Image must be JPEG, PNG, or WebP')
    .optional(),
})

// Profile validation schema
export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  campus_name: z.string().min(1, 'Campus is required'),
  telegram_handle: z.string()
    .regex(/^@?[a-zA-Z0-9_]{5,32}$/, 'Invalid Telegram handle. Must be 5-32 characters with only letters, numbers, and underscores'),
})

// Auth validation schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  campus_name: z.string().min(1, 'Campus is required'),
  telegram_handle: z.string()
    .regex(/^@?[a-zA-Z0-9_]{5,32}$/, 'Invalid Telegram handle. Must be 5-32 characters with only letters, numbers, and underscores'),
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})
