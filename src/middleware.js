// Middleware to handle CORS for all API routes
// This ensures that our application can make requests to external APIs like Punting Form

import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the origin from the request
  const origin = request.headers.get('origin') || '';
  
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;
  
  // Only apply CORS middleware to API routes
  if (pathname.startsWith('/api/')) {
    // Create a new response
    const response = NextResponse.next();
    
    // Add CORS headers to the response
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-API-KEY');
    
    // If it's an OPTIONS request, return a 200 response
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200 });
    }
    
    return response;
  }
  
  // For non-API routes, just continue with the request
  return NextResponse.next();
}

// Configure the middleware to run only for API routes
export const config = {
  matcher: '/api/:path*',
};