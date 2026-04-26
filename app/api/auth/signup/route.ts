import { NextRequest, NextResponse } from 'next/server';
import { createUser, initializeDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { username, password, role } = await request.json();

    if (!username || !password || !role) {
      return NextResponse.json(
        { error: 'Username, password, and role are required.' },
        { status: 400 }
      );
    }

    const user = await createUser(username, password, role);
    
    return NextResponse.json(
      { message: 'Account created successfully', user },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === 'Username already exists') {
      return NextResponse.json(
        { error: 'Username already exists. Please choose another username.' },
        { status: 409 }
      );
    }
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
