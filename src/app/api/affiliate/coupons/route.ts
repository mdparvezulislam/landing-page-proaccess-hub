import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateCoupon from '@/models/AffiliateCoupon';
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

    const coupons = await AffiliateCoupon.find({ affiliateId }).lean();

    return NextResponse.json({
      coupons: coupons.map(c => ({
        id: c._id,
        couponCode: c.couponCode,
        discountPercent: c.discountPercent,
        commissionPercent: c.commissionPercent,
        usageLimit: c.usageLimit,
        totalUsed: c.totalUsed,
        active: c.active,
        expireDate: c.expireDate,
        createdAt: c.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}
