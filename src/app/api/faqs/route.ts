import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FAQ from '@/models/FAQ';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    await connectDB();
    const faqs = await FAQ.find({ visible: true }).sort({ order: 1 });
    return NextResponse.json(faqs);
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
      const faq = await FAQ.findByIdAndUpdate(_id, updateData, { new: true });
      if (!faq) return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
      return NextResponse.json(faq);
    }

    const faq = await FAQ.create(updateData);
    return NextResponse.json(faq);
  } catch (error: any) {
    console.error('POST /api/faqs Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
