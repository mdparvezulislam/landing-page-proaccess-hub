import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateUser from '@/models/AffiliateUser';
import AffiliateWallet from '@/models/AffiliateWallet';
import AffiliateReferral from '@/models/AffiliateReferral';
import AffiliateAnalytics from '@/models/AffiliateAnalytics';
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

    const user = await AffiliateUser.findById(affiliateId).select('referralLink affiliateCode');
    const wallet = await AffiliateWallet.findOne({ affiliateId });
    const referrals = await AffiliateReferral.find({ affiliateId }).sort({ createdAt: -1 }).limit(10).lean();

    const stats = await AffiliateReferral.aggregate([
      { $match: { affiliateId } },
      {
        $group: {
          _id: null,
          totalReferrals: { $sum: 1 },
          totalSales: { $sum: { $cond: [{ $in: ['$orderStatus', ['completed']] }, 1, 0] } },
          totalCommission: { $sum: '$commissionAmount' },
          totalDiscounts: { $sum: '$discountAmount' },
        },
      },
    ]);

    const monthlyChart = await AffiliateReferral.aggregate([
      { $match: { affiliateId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          sales: { $sum: { $cond: [{ $in: ['$orderStatus', ['completed']] }, 1, 0] } },
          commission: { $sum: '$commissionAmount' },
          referrals: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 12 },
    ]);

    const recentCommission = await AffiliateReferral.find({
      affiliateId,
      commissionStatus: { $ne: 'pending' },
    }).sort({ createdAt: -1 }).limit(5).lean();

    const aggregate = stats[0] || { totalReferrals: 0, totalSales: 0, totalCommission: 0, totalDiscounts: 0 };

    let conversionRate = 0;
    if (aggregate.totalReferrals > 0) {
      conversionRate = Math.round((aggregate.totalSales / aggregate.totalReferrals) * 100);
    }

    return NextResponse.json({
      referralLink: user?.referralLink || '',
      wallet: wallet ? {
        availableBalance: wallet.availableBalance,
        pendingBalance: wallet.pendingBalance,
        withdrawnBalance: wallet.withdrawnBalance,
        lifetimeEarnings: wallet.lifetimeEarnings,
      } : { availableBalance: 0, pendingBalance: 0, withdrawnBalance: 0, lifetimeEarnings: 0 },
      stats: {
        totalReferrals: aggregate.totalReferrals,
        totalSales: aggregate.totalSales,
        totalCommission: aggregate.totalCommission,
        totalDiscounts: aggregate.totalDiscounts,
        conversionRate,
      },
      recentReferrals: referrals,
      recentCommissions: recentCommission,
      monthlyChart,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
  }
}
