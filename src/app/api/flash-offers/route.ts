import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import FlashOffer from '@/models/FlashOffer';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    await connectDB();
    const offers = await FlashOffer.find().sort({ order: 1 });
    return NextResponse.json(offers);
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
      const offer = await FlashOffer.findByIdAndUpdate(_id, updateData, { new: true });
      if (!offer) return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
      revalidatePath('/');
      return NextResponse.json(offer);
    }

    const offer = await FlashOffer.create(updateData);
    revalidatePath('/');
    return NextResponse.json(offer);
  } catch (error: any) {
    console.error('POST /api/flash-offers Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
