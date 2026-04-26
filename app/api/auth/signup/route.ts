import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { username, password, role } = await request.json();

    // Validation
    if (!username || !password || !role) {
      return NextResponse.json(
        { error: 'Username, password, and role are required.' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists. Please choose another username.' },
        { status: 409 }
      );
    }

    // Create user
    const result = await query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, password, role]
    );

    return NextResponse.json(
      { message: 'Account created successfully', user: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
