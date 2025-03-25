import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Create a response
    const response = NextResponse.json({
      message: 'Logout successful'
    });
    
    // Clear the auth token cookie
    response.cookies.delete('auth-token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}