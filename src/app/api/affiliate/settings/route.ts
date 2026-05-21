import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateUser from '@/models/AffiliateUser';
import { verifyAffiliate, hashPassword } from '@/lib/affiliateAuth';

export async function PATCH(req: Request) {
  try {
    const { valid, payload } = await verifyAffiliate();
    if (!valid || !payload) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const { fullName, telegramUsername, password, paymentInfo } = await req.json();

    const updateData: any = {};

    if (fullName) updateData.fullName = fullName;
    if (telegramUsername !== undefined) updateData.telegramUsername = telegramUsername;
    if (password) updateData.passwordHash = await hashPassword(password);
    if (paymentInfo) updateData.paymentInfo = paymentInfo;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    await AffiliateUser.findByIdAndUpdate(payload.id, { $set: updateData });

    return NextResponse.json({ success: true, message: 'Settings updated' });
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
