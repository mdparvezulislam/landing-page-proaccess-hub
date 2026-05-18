import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPMembershipNotification from '@/models/VIPMembershipNotification';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const notification = await VIPMembershipNotification.findByIdAndUpdate(
      id,
      { $set: { ...body, readAt: body.read ? new Date() : null } },
      { new: true }
    );
    if (!notification) return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    return NextResponse.json(notification);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
