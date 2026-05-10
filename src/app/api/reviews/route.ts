import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import { verifyAdmin } from '@/lib/adminAuth';

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
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const data = await req.json().catch(() => null);
    if (!data) return NextResponse.json({ error: 'Invalid or missing data' }, { status: 400 });

    const { _id, ...updateData } = data;

    if (_id) {
      const review = await Review.findByIdAndUpdate(_id, updateData, { new: true });
      if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
      revalidatePath('/');
      return NextResponse.json(review);
    }

    const review = await Review.create(updateData);
    revalidatePath('/');
    return NextResponse.json(review);
  } catch (error: any) {
    console.error('POST /api/reviews Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
