import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPMembershipPayment from '@/models/VIPMembershipPayment';
import VIPMembershipUser from '@/models/VIPMembershipUser';
import AffiliateReferral from '@/models/AffiliateReferral';
import AffiliateUser from '@/models/AffiliateUser';
import AffiliateWallet from '@/models/AffiliateWallet';
import AffiliateTransaction from '@/models/AffiliateTransaction';
import AffiliateNotification from '@/models/AffiliateNotification';

async function processCommissionForVIPPayment(payment: any, member: any) {
  try {
    const orderId = member.membershipId;
    const referral = await AffiliateReferral.findOne({ orderId });
    if (!referral) return;

    if (referral.commissionStatus !== 'pending') return;

    referral.orderStatus = 'completed';
    referral.paymentId = payment._id.toString();
    referral.commissionStatus = 'pending';
    await referral.save();

    const wallet = await AffiliateWallet.findOne({ affiliateId: referral.affiliateId });
    if (wallet) {
      wallet.pendingBalance += referral.commissionAmount;
      wallet.lifetimeEarnings += referral.commissionAmount;
      wallet.lastUpdated = new Date();
      await wallet.save();
    } else {
      await AffiliateWallet.create({
        affiliateId: referral.affiliateId,
        pendingBalance: referral.commissionAmount,
        lifetimeEarnings: referral.commissionAmount,
      });
    }

    await AffiliateUser.findByIdAndUpdate(referral.affiliateId, {
      $inc: { totalSales: 1, totalCommission: referral.commissionAmount, pendingBalance: referral.commissionAmount, lifetimeEarnings: referral.commissionAmount },
    });

    await AffiliateTransaction.create({
      affiliateId: referral.affiliateId,
      type: 'referral_commission',
      amount: referral.commissionAmount,
      balanceBefore: wallet ? wallet.availableBalance : 0,
      balanceAfter: wallet ? wallet.availableBalance : 0,
      source: { referralId: referral._id.toString(), note: 'Commission from VIP payment approval' },
      status: 'pending',
      description: `Commission for ${referral.productName}`,
    });

    await AffiliateNotification.create({
      affiliateId: referral.affiliateId,
      type: 'new_commission',
      title: 'New Commission!',
      message: `VIP sale completed! You earned $${referral.commissionAmount.toFixed(2)} commission. It's pending admin approval.`,
    });
  } catch (err) {
    console.error('Commission processing error:', err);
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const isApproved = body.status === 'approved' || body.verified;
    const updateData: any = { ...body };
    if (isApproved) updateData.verified = true;
    if (body.status === 'rejected') updateData.verified = false;

    const payment = await VIPMembershipPayment.findByIdAndUpdate(
      id,
      { $set: { ...updateData, verifiedAt: isApproved ? new Date() : null } },
      { new: true }
    );
    if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

    if (isApproved) {
      const member = await VIPMembershipUser.findById(payment.membershipUserId);
      if (member) {
        const newPaidBDT = member.totalPaidBDT + payment.amountBDT;
        const newPaidUSDT = member.totalPaidUSDT + payment.amountUSDT;
        const newRemainingBDT = Math.max(0, member.remainingAmountBDT - payment.amountBDT);
        const newRemainingUSDT = Math.max(0, member.remainingAmountUSDT - payment.amountUSDT);
        const progress = member.remainingAmountBDT > 0
          ? Math.min(100, Math.round((newPaidBDT / (newPaidBDT + newRemainingBDT)) * 100))
          : 100;

        const now = new Date();
        const nextDueDate = new Date(now);
        nextDueDate.setDate(nextDueDate.getDate() + 30);

        await VIPMembershipUser.findByIdAndUpdate(payment.membershipUserId, {
          $set: {
            totalPaidBDT: newPaidBDT,
            totalPaidUSDT: newPaidUSDT,
            remainingAmountBDT: newRemainingBDT,
            remainingAmountUSDT: newRemainingUSDT,
            paymentProgress: progress,
            status: newRemainingBDT <= 0 ? 'completed' : 'active',
            nextDueDate,
            lastPaymentDate: now,
          },
        });

        await processCommissionForVIPPayment(payment, member);
      }
    }

    return NextResponse.json(payment);
  } catch {
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}
