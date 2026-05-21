import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateReferral from '@/models/AffiliateReferral';
import AffiliateUser from '@/models/AffiliateUser';
import AffiliateWallet from '@/models/AffiliateWallet';
import AffiliateTransaction from '@/models/AffiliateTransaction';
import AffiliateNotification from '@/models/AffiliateNotification';

export async function POST(req: Request) {
  try {
    const { orderId, paymentId, orderStatus, orderAmount } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    await connectDB();

    const referral = await AffiliateReferral.findOne({ orderId });
    if (!referral) {
      return NextResponse.json({ noReferral: true, message: 'No referral found for this order' });
    }

    if (orderStatus === 'cancelled' || orderStatus === 'refunded') {
      referral.orderStatus = orderStatus;
      referral.commissionStatus = 'pending';
      await referral.save();
      return NextResponse.json({ success: true, commissionStatus: 'cancelled' });
    }

    if (orderStatus !== 'completed' && orderStatus !== 'approved') {
      return NextResponse.json({ message: 'Order not yet completed' });
    }

    if (referral.commissionStatus !== 'pending') {
      return NextResponse.json({ message: 'Commission already processed' });
    }

    referral.orderStatus = 'completed';
    referral.paymentId = paymentId || referral.paymentId;
    if (orderAmount) referral.orderAmount = orderAmount;
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
      $inc: {
        totalSales: 1,
        totalCommission: referral.commissionAmount,
        pendingBalance: referral.commissionAmount,
        lifetimeEarnings: referral.commissionAmount,
      },
    });

    await AffiliateTransaction.create({
      affiliateId: referral.affiliateId,
      type: 'referral_commission',
      amount: referral.commissionAmount,
      balanceBefore: wallet ? wallet.availableBalance : 0,
      balanceAfter: wallet ? wallet.availableBalance : 0,
      source: { referralId: referral._id.toString(), note: 'Commission from approved payment' },
      status: 'pending',
      description: `Commission for ${referral.productName}`,
    });

    await AffiliateNotification.create({
      affiliateId: referral.affiliateId,
      type: 'new_commission',
      title: 'New Commission!',
      message: `A sale has been completed! You earned $${referral.commissionAmount.toFixed(2)} commission. It's pending admin approval.`,
    });

    return NextResponse.json({
      success: true,
      referral: {
        id: referral._id,
        commissionAmount: referral.commissionAmount,
        commissionStatus: 'pending',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process commission' }, { status: 500 });
  }
}
