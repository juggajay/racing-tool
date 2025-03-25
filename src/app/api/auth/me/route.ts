import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// In a real application, you would use a database to store and retrieve user data
// This is a simplified example for demonstration purposes
const USERS = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'password123', // In a real app, this would be hashed
    name: 'Demo User',
    verified: true
  }
];

export async function GET() {
  try {
    // Get the authentication token from cookies
    const authToken = cookies().get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // In a real application, you would:
    // 1. Verify the token (e.g., JWT verification)
    // 2. Retrieve the user from the database based on the token
    
    // For this example, we'll extract the user ID from the token
    // Format: token_userId_timestamp
    const tokenParts = authToken.split('_');
    if (tokenParts.length < 2) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const userId = tokenParts[1];
    
    // Find the user by ID
    const user = USERS.find(u => u.id === userId);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return user data (excluding password)
    const { password: _, ...userData } = user;
    return NextResponse.json({
      user: userData
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'An error occurred during authentication check' },
      { status: 500 }
    );
  }
}