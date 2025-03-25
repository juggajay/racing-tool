import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { D1Database } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
}

export async function POST(request: NextRequest, { env }: { env: Env }) {
  try {
    const { username, password, action } = await request.json();

    if (!username || !password || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (action === 'login') {
      // Get user from database
      const user = await env.DB.prepare(
        'SELECT id, username, password_hash, role FROM users WHERE username = ?'
      )
        .bind(username)
        .first();

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

      await env.DB.prepare(
        'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
      )
        .bind(sessionId, user.id, expiresAt.toISOString())
        .run();

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
      const existingUser = await env.DB.prepare(
        'SELECT id FROM users WHERE username = ?'
      )
        .bind(username)
        .first();

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
      const result = await env.DB.prepare(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)'
      )
        .bind(username, `${username}@example.com`, passwordHash, 'user')
        .run();

      if (!result.success) {
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'User registered successfully',
      });
    } else if (action === 'logout') {
      // Get session ID from cookie
      const sessionId = cookies().get('session')?.value;

      if (sessionId) {
        // Delete session from database
        await env.DB.prepare('DELETE FROM sessions WHERE id = ?')
          .bind(sessionId)
          .run();

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

export async function GET(request: NextRequest, { env }: { env: Env }) {
  try {
    // Get session ID from cookie
    const sessionId = cookies().get('session')?.value;

    if (!sessionId) {
      return NextResponse.json({ authenticated: false });
    }

    // Get session from database
    const session = await env.DB.prepare(
      'SELECT s.id, s.user_id, s.expires_at, u.username, u.role FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ?'
    )
      .bind(sessionId)
      .first();

    if (!session) {
      cookies().delete('session');
      return NextResponse.json({ authenticated: false });
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Delete expired session
      await env.DB.prepare('DELETE FROM sessions WHERE id = ?')
        .bind(sessionId)
        .run();

      cookies().delete('session');
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user_id,
        username: session.username,
        role: session.role,
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