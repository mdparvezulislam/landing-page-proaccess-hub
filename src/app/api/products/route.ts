import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ order: 1 });
    return NextResponse.json(products);
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
      const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      revalidatePath('/');
      return NextResponse.json(product);
    }

    const product = await Product.create(updateData);
    revalidatePath('/');
    return NextResponse.json(product);
  } catch (error: any) {
    console.error('POST /api/products Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
