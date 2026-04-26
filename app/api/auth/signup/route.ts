import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { username, password, role } = await request.json();

    if (!username || !password || !role) {
      return NextResponse.json(
        { error: 'Username, password, and role are required.' },
        { status: 400 }
      );
    }

    const result = await createUser(username, password, role);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signup.' },
      { status: 500 }
    );
  }
}
