import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPMembershipPayment from '@/models/VIPMembershipPayment';

export async function GET() {
  try {
    await connectDB();
    const payments = await VIPMembershipPayment.find()
      .populate('membershipUserId')
      .sort({ paymentDate: -1 })
      .lean();
    return NextResponse.json(payments);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch VIP payments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const payment = await VIPMembershipPayment.create(body);
    return NextResponse.json(payment, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
