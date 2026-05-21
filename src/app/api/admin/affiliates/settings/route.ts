import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateGlobalSettings from '@/models/AffiliateGlobalSettings';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    let settings = await AffiliateGlobalSettings.findOne().lean();
    if (!settings) {
      settings = await AffiliateGlobalSettings.create({
        defaultDiscountPercent: 5,
        defaultCommissionPercent: 20,
        minWithdrawal: 5,
        maxWithdrawal: 0,
        referralCookieDays: 30,
      });
    }

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const allowed = ['defaultDiscountPercent', 'defaultCommissionPercent', 'referralSignupReward', 'minWithdrawal', 'maxWithdrawal', 'referralCookieDays', 'defaultCurrency'];
    const updateData: any = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    let settings = await AffiliateGlobalSettings.findOne();
    if (!settings) {
      settings = await AffiliateGlobalSettings.create({
        defaultDiscountPercent: 5,
        defaultCommissionPercent: 20,
        minWithdrawal: 5,
        maxWithdrawal: 0,
        referralCookieDays: 30,
        ...updateData,
      });
    } else {
      await AffiliateGlobalSettings.findByIdAndUpdate(settings._id, { $set: updateData });
    }

    const updated = await AffiliateGlobalSettings.findOne().lean();
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
