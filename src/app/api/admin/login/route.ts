import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminAuthToken } from '@/lib/adminAuth';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body as { email?: string; password?: string };

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('Admin credentials not configured in environment variables');
      return NextResponse.json({ error: 'Admin credentials not configured' }, { status: 500 });
    }

    if (!email || !password || email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createAdminAuthToken(email);
    const cookieStore = await cookies();
    
    cookieStore.set({
      name: 'admin-auth',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ ok: true, message: 'Login successful' });
  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
