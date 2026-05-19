import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import FlashOffer from '@/models/FlashOffer';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const offer = await FlashOffer.findById(id);
    if (!offer) return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    return NextResponse.json(offer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    await connectDB();
    const data = await req.json();
    const offer = await FlashOffer.findByIdAndUpdate(id, data, { new: true });
    if (!offer) return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    revalidatePath('/');
    return NextResponse.json(offer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    await connectDB();
    await FlashOffer.findByIdAndDelete(id);
    revalidatePath('/');
    return NextResponse.json({ message: 'Deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
