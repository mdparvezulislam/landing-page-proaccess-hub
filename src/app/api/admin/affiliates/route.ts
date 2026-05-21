import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateUser from '@/models/AffiliateUser';
import AffiliateCoupon from '@/models/AffiliateCoupon';
import AffiliateWallet from '@/models/AffiliateWallet';
import AffiliateNotification from '@/models/AffiliateNotification';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const affiliates = await AffiliateUser.find().select('-passwordHash').sort({ joinedAt: -1 }).lean();

    const affiliateIds = affiliates.map(a => a._id);
    const coupons = await AffiliateCoupon.find({ affiliateId: { $in: affiliateIds } }).lean();
    const couponMap = new Map(coupons.map(c => [c.affiliateId.toString(), c]));

    const enriched = affiliates.map(aff => ({
      ...aff,
      coupon: couponMap.get(aff._id.toString()) || null,
    }));

    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch affiliates' }, { status: 500 });
  }
}
