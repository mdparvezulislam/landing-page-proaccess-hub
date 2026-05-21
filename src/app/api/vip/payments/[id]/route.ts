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

    const originalReferral = await AffiliateReferral.findOne({ orderId });
    if (!originalReferral) return;

    const existingForPayment = await AffiliateReferral.findOne({ paymentId: payment._id.toString() });
    if (existingForPayment) return;

    const affiliateId = originalReferral.affiliateId;
    const commissionPercent = originalReferral.commissionPercent;
    const isFirstPayment = originalReferral.paymentId === payment._id.toString();

    let commissionAmount: number;
    let description: string;
    let note: string;

    if (isFirstPayment) {
      commissionAmount = originalReferral.commissionAmount;
      description = `Commission for ${originalReferral.productName}`;
      note = 'Commission from VIP payment approval';
      originalReferral.orderStatus = 'completed';
      originalReferral.commissionStatus = 'approved';
      originalReferral.commissionApprovedAt = new Date();
      await originalReferral.save();
    } else {
      commissionAmount = (payment.amountBDT * commissionPercent) / 100;
      description = `Commission for ${originalReferral.productName} (installment)`;
      note = 'Commission from VIP installment payment';
      await AffiliateReferral.create({
        buyerName: originalReferral.buyerName,
        buyerPhone: originalReferral.buyerPhone,
        buyerEmail: originalReferral.buyerEmail,
        buyerTelegram: originalReferral.buyerTelegram,
        affiliateId,
        couponCode: originalReferral.couponCode,
        discountPercent: 0,
        commissionPercent,
        source: 'vip_plan',
        productId: originalReferral.productId,
        productName: originalReferral.productName,
        planName: originalReferral.planName,
        orderAmount: payment.amountBDT,
        discountAmount: 0,
        commissionAmount,
        currency: 'BDT',
        orderId,
        paymentId: payment._id.toString(),
        orderStatus: 'completed',
        commissionStatus: 'approved',
        commissionApprovedAt: new Date(),
      });
    }

    const wallet = await AffiliateWallet.findOne({ affiliateId });
    if (wallet) {
      wallet.availableBalance += commissionAmount;
      wallet.lifetimeEarnings += commissionAmount;
      wallet.lastUpdated = new Date();
      await wallet.save();
    } else {
      await AffiliateWallet.create({
        affiliateId,
        availableBalance: commissionAmount,
        lifetimeEarnings: commissionAmount,
      });
    }

    const incFields: Record<string, number> = {
      totalCommission: commissionAmount,
      availableBalance: commissionAmount,
      lifetimeEarnings: commissionAmount,
    };
    if (isFirstPayment) incFields.totalSales = 1;
    await AffiliateUser.findByIdAndUpdate(affiliateId, { $inc: incFields });

    await AffiliateTransaction.create({
      affiliateId,
      type: 'referral_commission',
      amount: commissionAmount,
      balanceBefore: wallet ? wallet.availableBalance - commissionAmount : 0,
      balanceAfter: wallet ? wallet.availableBalance : 0,
      source: { referralId: originalReferral._id.toString(), note },
      status: 'completed',
      description,
    });

    await AffiliateNotification.create({
      affiliateId,
      type: 'new_commission',
      title: 'New Commission Approved!',
      message: `VIP ${isFirstPayment ? 'sale' : 'installment'} completed! You earned ৳${commissionAmount.toFixed(2)} commission. It's available for withdrawal.`,
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

        const nextDueBDT = newRemainingBDT <= 0 ? 0 : member.monthlyBDT > 0 ? Math.min(member.monthlyBDT, newRemainingBDT) : newRemainingBDT;
        const nextDueUSDT = newRemainingUSDT <= 0 ? 0 : member.monthlyUSDT > 0 ? Math.min(member.monthlyUSDT, newRemainingUSDT) : newRemainingUSDT;

        await VIPMembershipUser.findByIdAndUpdate(payment.membershipUserId, {
          $set: {
            totalPaidBDT: newPaidBDT,
            totalPaidUSDT: newPaidUSDT,
            remainingAmountBDT: newRemainingBDT,
            remainingAmountUSDT: newRemainingUSDT,
            nextDueAmountBDT: nextDueBDT,
            nextDueAmountUSDT: nextDueUSDT,
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
