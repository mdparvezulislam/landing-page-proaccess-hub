import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPMembershipNotification from '@/models/VIPMembershipNotification';

export async function GET() {
  try {
    await connectDB();
    const notifications = await VIPMembershipNotification.find()
      .populate('userId')
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(notifications);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const notification = await VIPMembershipNotification.create(body);
    return NextResponse.json(notification, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
