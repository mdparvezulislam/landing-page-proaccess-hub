import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const { valid } = await verifyAdmin();
    if (valid) {
      return NextResponse.json({ authenticated: true });
    }
    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
