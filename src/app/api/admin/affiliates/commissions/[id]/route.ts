import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateReferral from '@/models/AffiliateReferral';
import AffiliateUser from '@/models/AffiliateUser';
import AffiliateWallet from '@/models/AffiliateWallet';
import AffiliateTransaction from '@/models/AffiliateTransaction';
import AffiliateNotification from '@/models/AffiliateNotification';
import { verifyAdmin } from '@/lib/adminAuth';
import mongoose from 'mongoose';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    await connectDB();

    const referral = await AffiliateReferral.findById(id);
    if (!referral) return NextResponse.json({ error: 'Referral not found' }, { status: 404 });

    if (referral.commissionStatus !== 'pending') {
      return NextResponse.json({ error: 'Commission already processed' }, { status: 400 });
    }

    referral.commissionStatus = 'approved';
    referral.commissionApprovedAt = new Date();
    await referral.save();

    const wallet = await AffiliateWallet.findOne({ affiliateId: referral.affiliateId });
    if (wallet) {
      wallet.pendingBalance -= referral.commissionAmount;
      wallet.availableBalance += referral.commissionAmount;
      wallet.lastUpdated = new Date();
      await wallet.save();

      await AffiliateTransaction.create({
        affiliateId: referral.affiliateId,
        type: 'referral_commission',
        amount: referral.commissionAmount,
        balanceBefore: wallet.availableBalance - referral.commissionAmount,
        balanceAfter: wallet.availableBalance,
        source: { referralId: referral._id.toString(), note: 'Commission approved' },
        status: 'completed',
        description: `Commission approved for ${referral.productName}`,
      });
    }

    await AffiliateUser.findByIdAndUpdate(referral.affiliateId, {
      $inc: { availableBalance: referral.commissionAmount, pendingBalance: -referral.commissionAmount },
    });

    await AffiliateNotification.create({
      affiliateId: referral.affiliateId,
      type: 'new_commission',
      title: 'Commission Approved!',
      message: `Your commission of $${referral.commissionAmount.toFixed(2)} for a referral has been approved and added to your available balance.`,
    });

    return NextResponse.json({ success: true, referral });
  } catch {
    return NextResponse.json({ error: 'Failed to approve commission' }, { status: 500 });
  }
}
