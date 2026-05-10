import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminAuthToken } from './src/lib/adminAuth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin/dashboard')) {
    const token = req.cookies.get('admin-auth')?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }

    const { valid } = await verifyAdminAuthToken(token);
    if (!valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
