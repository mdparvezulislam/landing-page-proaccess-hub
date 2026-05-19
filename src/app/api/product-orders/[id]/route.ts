import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProductOrder from '@/models/ProductOrder';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const order = await ProductOrder.findById(id);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(order);
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

    if (data.status === 'active' && !data.activatedAt) {
      data.activatedAt = new Date();
    }
    if (data.status === 'completed') {
      data.completedAt = new Date();
    }
    if (data.status === 'cancelled') {
      data.cancelledAt = new Date();
    }
    if (data.action === 'ban') {
      data.banned = true;
      data.bannedAt = new Date();
      data.banReason = data.banReason || '';
      delete data.action;
    }
    if (data.action === 'unban') {
      data.banned = false;
      data.bannedAt = null;
      data.banReason = '';
      delete data.action;
    }

    const order = await ProductOrder.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(order);
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
    await ProductOrder.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
