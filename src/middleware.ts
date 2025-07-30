import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAppLive = process.env.NEXT_PUBLIC_APP_LIVE === 'true';
  const { pathname } = request.nextUrl;

  // Allow access to waitlist page, API routes, static assets, and auth callback
  // Allow access to waitlist page, API routes, static assets, auth callback, and media files
  const mediaExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.mp4', '.mp3', '.webm', '.ogg', '.wav', '.mov', '.avi'];
  if (
    pathname === '/waitlist' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public/') ||
    pathname === '/auth/callback' ||
    mediaExtensions.some(ext => pathname.toLowerCase().endsWith(ext)) ||
    isAppLive
  ) {
    // if(pathname.includes('/waitlist')) return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  }

  // Redirect to waitlist if app is not live
  return NextResponse.redirect(new URL('/waitlist', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
