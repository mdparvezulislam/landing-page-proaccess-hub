import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateCoupon from '@/models/AffiliateCoupon';
import AffiliateUser from '@/models/AffiliateUser';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    await connectDB();

    const coupon = await AffiliateCoupon.findOne({
      couponCode: code.toUpperCase(),
      active: true,
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });
    }

    if (coupon.expireDate && new Date() > coupon.expireDate) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 410 });
    }

    if (coupon.usageLimit > 0 && coupon.totalUsed >= coupon.usageLimit) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 410 });
    }

    const affiliate = await AffiliateUser.findById(coupon.affiliateId).select('fullName status banned');
    if (!affiliate || affiliate.banned || affiliate.status !== 'active') {
      return NextResponse.json({ error: 'This coupon is no longer available' }, { status: 403 });
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.couponCode,
        discountPercent: coupon.discountPercent,
        commissionPercent: coupon.commissionPercent,
        affiliateName: affiliate.fullName,
        affiliateId: coupon.affiliateId,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
