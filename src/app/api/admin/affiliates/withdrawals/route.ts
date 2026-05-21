import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateWithdrawal from '@/models/AffiliateWithdrawal';
import AffiliateUser from '@/models/AffiliateUser';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const withdrawals = await AffiliateWithdrawal.find().sort({ createdAt: -1 }).limit(50).lean();

    const affiliateIds = [...new Set(withdrawals.map(w => w.affiliateId.toString()))];
    const affiliates = await AffiliateUser.find({ _id: { $in: affiliateIds } }).select('fullName email').lean();
    const affMap = Object.fromEntries(affiliates.map(a => [a._id.toString(), a]));

    const enriched = withdrawals.map(w => ({
      ...w,
      affiliateName: affMap[w.affiliateId.toString()]?.fullName || 'Unknown',
    }));

    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }
}
