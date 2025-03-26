import { NextRequest, NextResponse } from 'next/server';

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

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json();
    
    // Validate input
    if (!email || !password || !username) {
      return NextResponse.json(
        { message: 'Email, password, and username are required' },
        { status: 400 }
      );
    }
    
    // Check if email is already registered
    const existingUser = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email is already registered' },
        { status: 409 }
      );
    }
    
    // In a real application, you would:
    // 1. Hash the password
    // 2. Store the user in a database
    // 3. Generate a verification token
    // 4. Send a verification email
    
    // For this example, we'll simulate creating a new user
    const newUser = {
      id: `${USERS.length + 1}`,
      email,
      password, // In a real app, this would be hashed
      name: username,
      verified: false
    };
    
    // In a real app, we would add the user to the database
    // USERS.push(newUser);
    
    // Simulate sending a verification email
    console.log(`Verification email sent to ${email}`);
    
    return NextResponse.json({
      message: 'Registration successful. Please check your email to verify your account.',
      userId: newUser.id
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}