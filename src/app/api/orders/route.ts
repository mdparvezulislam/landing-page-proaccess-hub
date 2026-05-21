import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyAdmin } from '@/lib/adminAuth';
import { rateLimit } from '@/lib/rate-limit';
import AffiliateReferral from '@/models/AffiliateReferral';
import AffiliateUser from '@/models/AffiliateUser';
import AffiliateCoupon from '@/models/AffiliateCoupon';
import AffiliateWallet from '@/models/AffiliateWallet';
import AffiliateTransaction from '@/models/AffiliateTransaction';
import AffiliateNotification from '@/models/AffiliateNotification';
import AffiliateGlobalSettings from '@/models/AffiliateGlobalSettings';

async function processProductReferral(data: any, orderId: string) {
  const { couponCode, affiliateCode, customerName, telegramUsername, productName, plan, amount, source } = data;
  
  let foundAffiliateId: string | null = null;
  let discountPercent = 0;
  let commissionPercent = 20;
  let usedCouponCode = '';

  if (couponCode) {
    const coupon = await AffiliateCoupon.findOne({ couponCode: couponCode.toUpperCase(), active: true });
    if (coupon) {
      const affiliate = await AffiliateUser.findById(coupon.affiliateId);
      if (affiliate && !affiliate.banned && affiliate.status === 'active') {
        foundAffiliateId = affiliate._id.toString();
        discountPercent = coupon.discountPercent;
        commissionPercent = coupon.commissionPercent;
        usedCouponCode = coupon.couponCode;
        coupon.totalUsed += 1;
        await coupon.save();
      }
    }
  }

  if (!foundAffiliateId && affiliateCode) {
    const affiliate = await AffiliateUser.findOne({ affiliateCode, banned: false, status: 'active' });
    if (affiliate) {
      foundAffiliateId = affiliate._id.toString();
      discountPercent = 5;
      commissionPercent = 20;
    }
  }

  if (!foundAffiliateId) return;

  const aff = await AffiliateUser.findById(foundAffiliateId);
  if (aff && data.telegramUsername && data.telegramUsername.replace('@', '') === aff.telegramUsername.replace('@', '')) return;
  if (aff && data.customerName && data.customerName.toLowerCase() === aff.fullName.toLowerCase()) return;

  const effectiveAmount = data.originalAmount && data.originalAmount > amount ? data.originalAmount : amount;
  const effectiveDiscount = (effectiveAmount * discountPercent) / 100;
  const commissionAmount = (effectiveAmount * commissionPercent) / 100;

  const existing = await AffiliateReferral.findOne({ orderId });
  if (existing) return;

  await AffiliateReferral.create({
    buyerName: customerName || '',
    buyerTelegram: telegramUsername || '',
    affiliateId: foundAffiliateId,
    couponCode: usedCouponCode,
    discountPercent,
    commissionPercent,
    source: source || 'product',
    productName: productName || '',
    planName: plan || '',
    orderAmount: effectiveAmount,
    discountAmount: effectiveDiscount,
    commissionAmount,
    currency: 'BDT',
    orderId,
    orderStatus: 'pending',
    commissionStatus: 'pending',
  });

  await AffiliateUser.findByIdAndUpdate(foundAffiliateId, { $inc: { totalReferrals: 1 } });

  await AffiliateNotification.create({
    affiliateId: foundAffiliateId,
    type: 'referral_converted',
    title: 'New Referral!',
    message: `Someone purchased ${productName} using your referral link. Commission: $${commissionAmount.toFixed(2)} (pending).`,
  });

  const settings = await AffiliateGlobalSettings.findOne().lean() as any;
  const signupReward = settings?.referralSignupReward || 0;
  if (signupReward > 0) {
    let wallet = await AffiliateWallet.findOne({ affiliateId: foundAffiliateId });
    if (!wallet) {
      wallet = await AffiliateWallet.create({
        affiliateId: foundAffiliateId,
        availableBalance: 0,
        pendingBalance: 0,
        withdrawnBalance: 0,
        totalEarned: 0,
      });
    }

    const rewardAmount = signupReward;
    wallet.availableBalance += rewardAmount;
    wallet.totalEarned += rewardAmount;
    wallet.lastUpdated = new Date();
    await wallet.save();

    await AffiliateTransaction.create({
      affiliateId: foundAffiliateId,
      type: 'bonus',
      amount: rewardAmount,
      balanceBefore: wallet.availableBalance - rewardAmount,
      balanceAfter: wallet.availableBalance,
      source: { note: `Referral signup reward — ${customerName || telegramUsername || 'new user'}` },
      status: 'completed',
      description: `Referral signup reward of ৳${rewardAmount} for referring a new customer`,
    });

    await AffiliateNotification.create({
      affiliateId: foundAffiliateId,
      type: 'bonus',
      title: 'Referral Signup Reward!',
      message: `You earned ৳${rewardAmount} signup reward for referring ${customerName || telegramUsername || 'a new customer'}!`,
    });
  }
}

export async function GET() {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    if (!rateLimit(ip, 5)) {
      return NextResponse.json({ error: 'Too many order attempts. Please try again later.' }, { status: 429 });
    }

    await connectDB();
    const data = await req.json().catch(() => null);
    if (!data) return NextResponse.json({ error: 'Invalid or missing data' }, { status: 400 });
    
    const order = await Order.create(data);

    if (data.couponCode || data.affiliateCode) {
      await processProductReferral(data, order._id.toString());
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('POST /api/orders Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json().catch(() => null);
    if (!body || !body.id) return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });

    const { id, ...updateData } = body;
    const prevOrder = await Order.findById(id);
    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const approvedStatuses = ['Completed', 'completed', 'active'];
    if (approvedStatuses.includes(updateData.status) && !approvedStatuses.includes(prevOrder?.status || '')) {
      const referral = await AffiliateReferral.findOne({ orderId: order._id.toString() });
      if (referral && referral.commissionStatus === 'pending') {
        referral.orderStatus = 'completed';
        referral.commissionStatus = 'approved';
        referral.commissionApprovedAt = new Date();
        await referral.save();

        const wallet = await AffiliateWallet.findOne({ affiliateId: referral.affiliateId });
        if (wallet) {
          wallet.availableBalance += referral.commissionAmount;
          wallet.lifetimeEarnings += referral.commissionAmount;
          wallet.lastUpdated = new Date();
          await wallet.save();
        }

        await AffiliateUser.findByIdAndUpdate(referral.affiliateId, {
          $inc: { totalSales: 1, totalCommission: referral.commissionAmount, availableBalance: referral.commissionAmount, lifetimeEarnings: referral.commissionAmount },
        });

        await AffiliateTransaction.create({
          affiliateId: referral.affiliateId,
          type: 'referral_commission',
          amount: referral.commissionAmount,
          balanceBefore: wallet ? wallet.availableBalance - referral.commissionAmount : 0,
          balanceAfter: wallet ? wallet.availableBalance : 0,
          source: { referralId: referral._id.toString(), note: 'Commission from product order approval' },
          status: 'completed',
          description: `Commission for ${referral.productName}`,
        });

        await AffiliateNotification.create({
          affiliateId: referral.affiliateId,
          type: 'new_commission',
          title: 'New Commission Approved!',
          message: `Product sale completed! You earned ৳${referral.commissionAmount.toFixed(2)} commission. It's available for withdrawal.`,
        });
      }
    }
    
    return NextResponse.json(order);
  } catch (error: any) {
    console.error('PATCH /api/orders Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
