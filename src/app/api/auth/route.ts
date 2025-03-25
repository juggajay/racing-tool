import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// In-memory storage for demonstration purposes
// In a real application, you would use a database
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password_hash: '$2a$10$JwU8S5vRVVH.iVMv1yCkZOQgX0XW6H1zXpBJ5o9X2MaW1LWle1bJe', // admin123
    role: 'admin'
  }
];

const sessions: Record<string, { user_id: number, expires_at: string }> = {};

export async function POST(request: NextRequest) {
  try {
    const { username, password, action } = await request.json();

    if (!username || !password || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (action === 'login') {
      // Find user
      const user = users.find(u => u.username === username);

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Create session
      const sessionId = uuidv4();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      sessions[sessionId] = {
        user_id: user.id,
        expires_at: expiresAt.toISOString()
      };

      // Set cookie
      cookies().set({
        name: 'session',
        value: sessionId,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } else if (action === 'register') {
      // Check if user already exists
      const existingUser = users.find(u => u.username === username);

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 400 }
        );
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create user
      const newUser = {
        id: users.length + 1,
        username,
        email: `${username}@example.com`,
        password_hash: passwordHash,
        role: 'user'
      };
      
      users.push(newUser);

      return NextResponse.json({
        success: true,
        message: 'User registered successfully',
      });
    } else if (action === 'logout') {
      // Get session ID from cookie
      const sessionId = cookies().get('session')?.value;

      if (sessionId && sessions[sessionId]) {
        // Delete session
        delete sessions[sessionId];
        
        // Clear cookie
        cookies().delete('session');
      }

      return NextResponse.json({
        success: true,
        message: 'Logged out successfully',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get session ID from cookie
    const sessionId = cookies().get('session')?.value;

    if (!sessionId || !sessions[sessionId]) {
      return NextResponse.json({ authenticated: false });
    }

    const session = sessions[sessionId];
    
    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Delete expired session
      delete sessions[sessionId];
      
      cookies().delete('session');
      return NextResponse.json({ authenticated: false });
    }

    // Find user
    const user = users.find(u => u.id === session.user_id);
    
    if (!user) {
      cookies().delete('session');
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}