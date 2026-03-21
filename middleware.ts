import { type NextRequest, NextResponse } from "next/server";
import { updateSession, checkVerificationStatus } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Skip verification check for public routes and static files
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/listings'];
  const verificationRoutes = ['/auth/verify-id'];
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  const isVerificationRoute = verificationRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute || pathname.startsWith('/_next') || pathname.startsWith('/public')) {
    return response;
  }

  // Check verification status for authenticated users
  const verificationStatus = await checkVerificationStatus(request);

  if (!verificationStatus) {
    // Not logged in - continue (auth pages will handle redirect to login)
    return response;
  }

  // Admin routes - check admin status
  if (pathname.startsWith('/admin')) {
    if (!verificationStatus.isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  // Admin users are automatically considered verified (skip verification)
  if (verificationStatus.isAdmin) {
    // Admins trying to access verification routes - redirect to dashboard
    if (isVerificationRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  // Unverified/pending users can only access verification routes
  if (!verificationStatus.isVerified && !isVerificationRoute) {
    return NextResponse.redirect(new URL('/auth/verify-id', request.url));
  }

  // Verified users trying to access verification routes - redirect to dashboard
  if (verificationStatus.isVerified && isVerificationRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
