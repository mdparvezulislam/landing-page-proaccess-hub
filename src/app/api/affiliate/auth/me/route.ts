import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateUser from '@/models/AffiliateUser';
import AffiliateCoupon from '@/models/AffiliateCoupon';
import { verifyAffiliate } from '@/lib/affiliateAuth';

export async function GET() {
  try {
    const { valid, payload } = await verifyAffiliate();
    if (!valid || !payload) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const user = await AffiliateUser.findById(payload.id).select('-passwordHash');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const coupon = await AffiliateCoupon.findOne({ affiliateId: user._id }).lean();

    return NextResponse.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        telegramUsername: user.telegramUsername,
        affiliateCode: user.affiliateCode,
        referralLink: user.referralLink,
        status: user.status,
        totalReferrals: user.totalReferrals,
        totalSales: user.totalSales,
        totalCommission: user.totalCommission,
        availableBalance: user.availableBalance,
        pendingBalance: user.pendingBalance,
        withdrawnBalance: user.withdrawnBalance,
        lifetimeEarnings: user.lifetimeEarnings,
        verified: user.verified,
        banned: user.banned,
        banReason: user.banReason,
        paymentInfo: user.paymentInfo,
        joinedAt: user.joinedAt,
        lastLoginAt: user.lastLoginAt,
        promotionMethod: user.promotionMethod,
        rejectionNote: user.rejectionNote,
        approvalNote: user.approvalNote,
        coupon: coupon ? {
          couponCode: coupon.couponCode,
          discountPercent: coupon.discountPercent,
          commissionPercent: coupon.commissionPercent,
          usageLimit: coupon.usageLimit,
          totalUsed: coupon.totalUsed,
          active: coupon.active,
        } : null,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
