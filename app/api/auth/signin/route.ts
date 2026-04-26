import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const user = await getUserByUsername(username);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Authentication failed. Please check your username and password.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

    response.cookies.set('auth_token', JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signin.' },
      { status: 500 }
    );
  }
}
