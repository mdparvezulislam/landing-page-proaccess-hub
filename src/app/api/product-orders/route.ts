import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProductOrder from '@/models/ProductOrder';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const orders = await ProductOrder.find().sort({ joinedAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }
    await connectDB();
    await ProductOrder.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ message: `${ids.length} orders deleted` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json().catch(() => null);
    if (!data) return NextResponse.json({ error: 'Invalid or missing data' }, { status: 400 });

    const { _id, ...orderData } = data;

    if (_id) {
      const { valid } = await verifyAdmin();
      if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const order = await ProductOrder.findByIdAndUpdate(_id, orderData, { new: true });
      if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      return NextResponse.json(order);
    }

    const order = await ProductOrder.create(orderData);
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/product-orders Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
