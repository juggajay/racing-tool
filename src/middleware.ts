import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public paths that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify',
  '/_next',
  '/favicon.ico',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // AUTHENTICATION DISABLED: Website is now open for all users
  // The code below is kept for reference in case authentication needs to be re-enabled
  
  /*
  // Check if the path is public
  const isPublicPath = publicPaths.some(path =>
    pathname === path || pathname.startsWith(path + '/')
  );
  
  // Get the authentication token from cookies
  const authToken = request.cookies.get('auth-token')?.value;
  
  // If the path is not public and the user is not authenticated, redirect to login
  if (!isPublicPath && !authToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // If the user is authenticated and trying to access login/register, redirect to home
  if (authToken && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  */
  
  // Allow all requests to proceed
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - API routes that need to use cookies
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth/me|api/auth/login|api/auth/logout).*)',
  ],
};

// Export the Edge Runtime flag
export const runtime = 'experimental-edge';