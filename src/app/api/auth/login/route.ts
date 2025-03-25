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

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Check if user exists and password is correct
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Check if user is verified
    if (!user.verified) {
      return NextResponse.json(
        { message: 'Please verify your email before logging in' },
        { status: 403 }
      );
    }
    
    // Create a session token (in a real app, this would be a JWT or other secure token)
    const token = `token_${user.id}_${Date.now()}`;
    
    // Set the token in a cookie
    cookies().set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    // Return success response with user data (excluding password)
    const { password: _, ...userData } = user;
    return NextResponse.json({
      message: 'Login successful',
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}