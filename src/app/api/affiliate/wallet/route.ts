import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateWallet from '@/models/AffiliateWallet';
import AffiliateTransaction from '@/models/AffiliateTransaction';
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

    const wallet = await AffiliateWallet.findOne({ affiliateId });
    const transactions = await AffiliateTransaction.find({ affiliateId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      wallet: wallet ? {
        availableBalance: wallet.availableBalance,
        pendingBalance: wallet.pendingBalance,
        withdrawnBalance: wallet.withdrawnBalance,
        lifetimeEarnings: wallet.lifetimeEarnings,
        lastUpdated: wallet.lastUpdated,
      } : { availableBalance: 0, pendingBalance: 0, withdrawnBalance: 0, lifetimeEarnings: 0 },
      transactions: transactions.map(t => ({
        id: t._id,
        type: t.type,
        amount: t.amount,
        balanceBefore: t.balanceBefore,
        balanceAfter: t.balanceAfter,
        source: t.source,
        status: t.status,
        description: t.description,
        createdAt: t.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
  }
}
