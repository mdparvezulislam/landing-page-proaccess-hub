import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPMembershipPayment from '@/models/VIPMembershipPayment';

export async function GET(req: Request) {
  try {
    const memberId = req.headers.get('x-member-id');
    const accessCode = req.headers.get('x-access-code');
    if (!memberId || !accessCode) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const payments = await VIPMembershipPayment.find({ membershipUserId: memberId })
      .sort({ paymentDate: -1 })
      .lean();

    return NextResponse.json(payments);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
