import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    // Find user
    const result = await query(
      'SELECT id, username, password, role FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Authentication failed. Please check your username and password.' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Check password
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Authentication failed. Please check your username and password.' },
        { status: 401 }
      );
    }

    // Return user data (without password)
    return NextResponse.json(
      {
        message: 'Sign in successful',
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    );
  }
}
