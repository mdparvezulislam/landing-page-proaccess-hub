import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyAdminAuthToken } from '@/lib/adminAuth';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const token = cookieHeader.split(';').map((c) => c.trim()).find((c) => c.startsWith('admin-auth='))?.split('=')[1];
    const { valid } = token ? await verifyAdminAuthToken(decodeURIComponent(token)) : { valid: false };
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (!rateLimit(ip, 5)) { // Limit to 5 orders per minute per IP
      return NextResponse.json({ error: 'Too many order attempts. Please try again later.' }, { status: 429 });
    }

    await connectDB();
    const data = await req.json();
    const order = await Order.create(data);
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const token = cookieHeader.split(';').map((c) => c.trim()).find((c) => c.startsWith('admin-auth='))?.split('=')[1];
    const { valid } = token ? await verifyAdminAuthToken(decodeURIComponent(token)) : { valid: false };
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const { id, ...updateData } = await req.json();
    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
