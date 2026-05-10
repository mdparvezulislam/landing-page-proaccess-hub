import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import { verifyAdminAuthToken } from '@/lib/adminAuth';

export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find({ visible: true }).sort({ order: 1 });
    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const token = cookieHeader.split(';').map((c) => c.trim()).find((c) => c.startsWith('admin-auth='))?.split('=')[1];
    const { valid } = token ? await verifyAdminAuthToken(decodeURIComponent(token)) : { valid: false };
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const data = await req.json();
    const review = await Review.create(data);
    return NextResponse.json(review);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
