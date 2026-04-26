import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, initializeDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const user = await verifyCredentials(username, password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication failed. Please check your username and password.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { message: 'Sign in successful', user },
      { status: 200 }
    );

    response.cookies.set('auth_user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    );
  }
}
