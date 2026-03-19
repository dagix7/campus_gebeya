import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Campus list for reference
export const CAMPUSES = {
  AAU_4_KILO: "AAU 4-Kilo",
  AAU_5_KILO: "AAU 5-Kilo",
  AAU_6_KILO: "AAU 6-Kilo",
  BIT: "BiT",
  ASTU: "ASTU",
} as const;

export const CAMPUS_OPTIONS = Object.values(CAMPUSES);

// Category types
export const CATEGORIES = {
  GEAR: "Gear",
  GIGS: "Gigs",
} as const;

export const CATEGORY_OPTIONS = Object.values(CATEGORIES);

// Listing status
export const LISTING_STATUS = {
  ACTIVE: "Active",
  SOLD: "Sold",
} as const;
