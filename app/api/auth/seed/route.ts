import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, seedAdminUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const result = await seedAdminUser();
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
