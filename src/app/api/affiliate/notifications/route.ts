import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateNotification from '@/models/AffiliateNotification';
import { verifyAffiliate } from '@/lib/affiliateAuth';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const { valid, payload } = await verifyAffiliate();
    if (!valid || !payload) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const affiliateId = new mongoose.Types.ObjectId(payload.id);

    const notifications = await AffiliateNotification.find({ affiliateId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const unreadCount = await AffiliateNotification.countDocuments({ affiliateId, read: false });

    return NextResponse.json({
      notifications: notifications.map(n => ({
        id: n._id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        createdAt: n.createdAt,
      })),
      unreadCount,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { valid, payload } = await verifyAffiliate();
    if (!valid || !payload) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const affiliateId = new mongoose.Types.ObjectId(payload.id);
    const { id, read } = await req.json();

    if (id === 'all') {
      await AffiliateNotification.updateMany({ affiliateId, read: false }, { $set: { read: true, readAt: new Date() } });
    } else {
      await AffiliateNotification.findByIdAndUpdate(id, { $set: { read, readAt: read ? new Date() : null } });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
