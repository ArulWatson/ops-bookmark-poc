import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('auth_user');
    
    if (!authCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = JSON.parse(authCookie.value);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check auth' },
      { status: 500 }
    );
  }
}
