import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyAdmin } from '@/lib/adminAuth';
import { rateLimit } from '@/lib/rate-limit';

export async function GET() {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (!rateLimit(ip, 5)) { // Limit to 5 orders per minute per IP
      return NextResponse.json({ error: 'Too many order attempts. Please try again later.' }, { status: 429 });
    }

    await connectDB();
    const data = await req.json().catch(() => null);
    if (!data) return NextResponse.json({ error: 'Invalid or missing data' }, { status: 400 });
    
    const order = await Order.create(data);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error('POST /api/orders Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json().catch(() => null);
    if (!body || !body.id) return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });

    const { id, ...updateData } = body;
    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    
    return NextResponse.json(order);
  } catch (error: any) {
    console.error('PATCH /api/orders Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
