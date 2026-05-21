import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateUser from '@/models/AffiliateUser';
import AffiliateReferral from '@/models/AffiliateReferral';
import AffiliateWallet from '@/models/AffiliateWallet';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const totalAffiliates = await AffiliateUser.countDocuments();
    const activeAffiliates = await AffiliateUser.countDocuments({ status: 'active' });
    const pendingApprovals = await AffiliateUser.countDocuments({ status: 'pending' });

    const referralStats = await AffiliateReferral.aggregate([
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

    const walletStats = await AffiliateWallet.aggregate([
      {
        $group: {
          _id: null,
          totalPending: { $sum: '$pendingBalance' },
          totalAvailable: { $sum: '$availableBalance' },
          totalWithdrawn: { $sum: '$withdrawnBalance' },
          totalLifetime: { $sum: '$lifetimeEarnings' },
        },
      },
    ]);

    const rs = referralStats[0] || { totalReferrals: 0, totalSales: 0, totalCommission: 0, totalDiscounts: 0 };
    const ws = walletStats[0] || { totalPending: 0, totalAvailable: 0, totalWithdrawn: 0, totalLifetime: 0 };
    const conversionRate = rs.totalReferrals > 0 ? (rs.totalSales / rs.totalReferrals) * 100 : 0;
    const avgCommissionPerSale = rs.totalSales > 0 ? rs.totalCommission / rs.totalSales : 0;
    const avgReferralsPerAffiliate = activeAffiliates > 0 ? rs.totalReferrals / activeAffiliates : 0;

    const topAffiliates = await AffiliateUser.find({ status: 'active' })
      .select('fullName email affiliateCode totalReferrals totalSales totalCommission')
      .sort({ totalCommission: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      totalAffiliates,
      activeAffiliates,
      pendingApprovals,
      totalReferrals: rs.totalReferrals,
      totalSales: rs.totalSales,
      totalCommission: rs.totalCommission,
      totalDiscounts: rs.totalDiscounts,
      conversionRate,
      avgCommissionPerSale,
      avgReferralsPerAffiliate,
      pendingPayouts: ws.totalPending,
      totalPaidOut: ws.totalWithdrawn,
      topAffiliates,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
