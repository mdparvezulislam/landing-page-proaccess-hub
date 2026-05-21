import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateWithdrawal from '@/models/AffiliateWithdrawal';
import AffiliateUser from '@/models/AffiliateUser';
import AffiliateWallet from '@/models/AffiliateWallet';
import AffiliateTransaction from '@/models/AffiliateTransaction';
import AffiliateNotification from '@/models/AffiliateNotification';
import { verifyAdmin } from '@/lib/adminAuth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { status, adminNote } = await req.json();

    await connectDB();

    const withdrawal = await AffiliateWithdrawal.findById(id);
    if (!withdrawal) return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });

    const updateData: any = { status, adminNote: adminNote || '' };

    if (status === 'approved' || status === 'rejected' || status === 'paid') {
      updateData.processedAt = new Date();
    }

    if (status === 'rejected') {
      const wallet = await AffiliateWallet.findOne({ affiliateId: withdrawal.affiliateId });
      if (wallet) {
        wallet.availableBalance += withdrawal.amount;
        wallet.withdrawnBalance -= withdrawal.amount;
        wallet.lastUpdated = new Date();
        await wallet.save();

        await AffiliateTransaction.create({
          affiliateId: withdrawal.affiliateId,
          type: 'adjustment',
          amount: withdrawal.amount,
          balanceBefore: wallet.availableBalance - withdrawal.amount,
          balanceAfter: wallet.availableBalance,
          source: { withdrawalId: withdrawal._id.toString(), note: `Rejected withdrawal: ${adminNote}` },
          status: 'completed',
          description: 'Withdrawal rejected - funds returned',
        });
      }
    }

    if (status === 'paid') {
      const wallet = await AffiliateWallet.findOne({ affiliateId: withdrawal.affiliateId });
      if (wallet) {
        const tx = await AffiliateTransaction.findOne({
          affiliateId: withdrawal.affiliateId,
          'source.withdrawalId': withdrawal._id.toString(),
          type: 'withdrawal',
        });
        if (tx) {
          tx.status = 'completed';
          await tx.save();
        }
      }
    }

    if (status === 'rejected') {
      withdrawal.amount = withdrawal.amount;
      await AffiliateNotification.create({
        affiliateId: withdrawal.affiliateId,
        type: 'withdrawal_rejected',
        title: 'Withdrawal Rejected',
        message: `Your withdrawal request for $${withdrawal.amount} has been rejected. ${adminNote ? `Reason: ${adminNote}` : ''}`,
      });
    }

    if (status === 'approved') {
      await AffiliateNotification.create({
        affiliateId: withdrawal.affiliateId,
        type: 'withdrawal_approved',
        title: 'Withdrawal Approved',
        message: `Your withdrawal request for $${withdrawal.amount} has been approved and is being processed.`,
      });
    }

    if (status === 'paid') {
      await AffiliateNotification.create({
        affiliateId: withdrawal.affiliateId,
        type: 'withdrawal_approved',
        title: 'Withdrawal Paid',
        message: `Your withdrawal of $${withdrawal.amount} has been sent. Check your account.`,
      });
    }

    await AffiliateWithdrawal.findByIdAndUpdate(id, { $set: updateData });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 500 });
  }
}
