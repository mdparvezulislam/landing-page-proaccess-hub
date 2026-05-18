import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPMembershipUser from '@/models/VIPMembershipUser';
import VIPMembershipPayment from '@/models/VIPMembershipPayment';

export async function GET() {
  try {
    await connectDB();

    const [totalMembers, activeMembers, pendingMembers, bannedMembers, totalPaymentsResult, totalRevenueBDT, totalRevenueUSDT] = await Promise.all([
      VIPMembershipUser.countDocuments(),
      VIPMembershipUser.countDocuments({ status: 'active' }),
      VIPMembershipUser.countDocuments({ status: 'pending' }),
      VIPMembershipUser.countDocuments({ banned: true }),
      VIPMembershipPayment.countDocuments({ verified: true }),
      VIPMembershipPayment.aggregate([
        { $match: { verified: true } },
        { $group: { _id: null, total: { $sum: '$amountBDT' } } },
      ]),
      VIPMembershipPayment.aggregate([
        { $match: { verified: true } },
        { $group: { _id: null, total: { $sum: '$amountUSDT' } } },
      ]),
    ]);

    return NextResponse.json({
      totalMembers,
      activeMembers,
      pendingMembers,
      bannedMembers,
      totalPayments: totalPaymentsResult,
      totalRevenueBDT: totalRevenueBDT[0]?.total || 0,
      totalRevenueUSDT: totalRevenueUSDT[0]?.total || 0,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch VIP stats' }, { status: 500 });
  }
}
