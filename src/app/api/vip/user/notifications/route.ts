import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPMembershipNotification from '@/models/VIPMembershipNotification';

export async function GET(req: Request) {
  try {
    const memberId = req.headers.get('x-member-id');
    const accessCode = req.headers.get('x-access-code');
    if (!memberId || !accessCode) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const notifications = await VIPMembershipNotification.find({ userId: memberId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(notifications);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const memberId = req.headers.get('x-member-id');
    const accessCode = req.headers.get('x-access-code');
    if (!memberId || !accessCode) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const { notificationId, read } = await req.json();

    if (notificationId) {
      await VIPMembershipNotification.findByIdAndUpdate(notificationId, { read, readAt: read ? new Date() : null });
    } else {
      await VIPMembershipNotification.updateMany(
        { userId: memberId, read: false },
        { read: true, readAt: new Date() }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
