import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPPlan from '@/models/VIPPlan';
import VIPMembershipUser from '@/models/VIPMembershipUser';
import VIPMembershipPayment from '@/models/VIPMembershipPayment';
import VIPMembershipNotification from '@/models/VIPMembershipNotification';
import AffiliateReferral from '@/models/AffiliateReferral';
import AffiliateUser from '@/models/AffiliateUser';
import AffiliateCoupon from '@/models/AffiliateCoupon';
import AffiliateWallet from '@/models/AffiliateWallet';
import AffiliateTransaction from '@/models/AffiliateTransaction';
import AffiliateNotification from '@/models/AffiliateNotification';

function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function processAffiliateReferral(body: any, orderId: string, paymentId: string, orderAmount: number, currency: string) {
  const { buyerName, buyerPhone, buyerTelegram, couponCode, affiliateCode, source, productId, productName, planName } = body;
  
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

  const affiliate = await AffiliateUser.findById(foundAffiliateId);
  if (!affiliate) return;
  if (buyerPhone && affiliate.telegramUsername && buyerPhone === affiliate.telegramUsername) return;
  if (buyerTelegram && affiliate.telegramUsername && buyerTelegram.replace('@', '') === affiliate.telegramUsername.replace('@', '')) return;

  const discountAmount = (orderAmount * discountPercent) / 100;
  const commissionAmount = (orderAmount * commissionPercent) / 100;

  const existing = await AffiliateReferral.findOne({ orderId });
  if (existing) return;

  await AffiliateReferral.create({
    buyerName: buyerName || '',
    buyerPhone: buyerPhone || '',
    buyerTelegram: buyerTelegram || '',
    affiliateId: foundAffiliateId,
    couponCode: usedCouponCode,
    discountPercent,
    commissionPercent,
    source,
    productId: productId || '',
    productName: productName || '',
    planName: planName || '',
    orderAmount,
    discountAmount,
    commissionAmount,
    currency,
    orderId,
    paymentId,
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
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { userName, phoneNumber, telegramUsername, telegramId, transactionId, screenshot, note, pricingTrack, paymentMethod, paymentMethodId, couponCode, affiliateCode } = body;

    if (!userName) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const bannedWithPhone = await VIPMembershipUser.findOne({ phoneNumber, banned: true });
    if (bannedWithPhone) {
      return NextResponse.json({ error: 'This phone number has been banned. Cannot place order.' }, { status: 403 });
    }

    const plan = await VIPPlan.findOne({ featured: true, visible: true });
    if (!plan) {
      return NextResponse.json({ error: 'No active VIP plan found' }, { status: 404 });
    }

    const isOfficial = pricingTrack === 'official';

    let starterBDT = isOfficial ? plan.officialStarterBDT : plan.starterPriceBDT;
    let starterUSDT = isOfficial ? plan.officialStarterUSDT : plan.starterPriceUSDT;
    const monthlyBDT = isOfficial ? plan.officialMonthlyBDT : plan.starterMonthlyBDT;
    const monthlyUSDT = isOfficial ? plan.officialMonthlyUSDT : plan.starterMonthlyUSDT;
    const totalBDT = starterBDT + (monthlyBDT * 12);
    const totalUSDT = starterUSDT + (monthlyUSDT * 12);

    let couponDiscountPercent = 0;
    let couponDiscountBDT = 0;
    let couponDiscountUSDT = 0;
    let usedCouponCode = '';

    if (couponCode) {
      const coupon = await AffiliateCoupon.findOne({ couponCode: couponCode.toUpperCase(), active: true });
      if (coupon && (!coupon.expireDate || new Date() <= coupon.expireDate) && (coupon.usageLimit === 0 || coupon.totalUsed < coupon.usageLimit)) {
        const affiliate = await AffiliateUser.findById(coupon.affiliateId);
        if (affiliate && !affiliate.banned && affiliate.status === 'active') {
          couponDiscountPercent = coupon.discountPercent;
          couponDiscountBDT = Math.round(starterBDT * couponDiscountPercent / 100);
          couponDiscountUSDT = Math.round(starterUSDT * couponDiscountPercent / 100);
          starterBDT -= couponDiscountBDT;
          starterUSDT -= couponDiscountUSDT;
          usedCouponCode = coupon.couponCode.toUpperCase();
        }
      }
    }

    const now = new Date();
    const nextDueDate = new Date(now);
    nextDueDate.setDate(nextDueDate.getDate() + 30);

    const accessCode = generateAccessCode();

    const member = await VIPMembershipUser.create({
      userName: userName || 'Member',
      phoneNumber: phoneNumber || '',
      telegramUsername: telegramUsername || '',
      telegramId: telegramId || '',
      accessCode,
      selectedVIPPlanId: plan._id,
      membershipType: isOfficial ? 'premium' : 'starter',
      totalPaidBDT: 0,
      totalPaidUSDT: 0,
      remainingAmountBDT: totalBDT - couponDiscountBDT,
      remainingAmountUSDT: totalUSDT - couponDiscountUSDT,
      monthlyBDT,
      monthlyUSDT,
      nextDueAmountBDT: starterBDT,
      nextDueAmountUSDT: starterUSDT,
      nextDueDate,
      paymentProgress: 0,
      totalPaymentsCount: 1,
      completedPaymentsCount: 0,
      status: 'pending',
      lastPaymentDate: new Date(),
      dashboardEnabled: true,
      couponCode: usedCouponCode,
      discountPercent: couponDiscountPercent,
      discountAmount: couponDiscountBDT,
    });

    const payment = await VIPMembershipPayment.create({
      membershipUserId: member._id,
      amountBDT: starterBDT,
      amountUSDT: starterUSDT,
      paymentMethod: paymentMethod || 'manual',
      paymentMethodId: paymentMethodId || '',
      transactionId: transactionId || `MANUAL-${Date.now()}`,
      screenshot: screenshot || '',
      note: note || 'Initial joining payment',
      status: 'pending',
      verified: false,
    });

    await VIPMembershipNotification.create({
      userId: member._id,
      type: 'membership_activated',
      titleEn: 'Welcome to VIP Membership!',
      titleBn: 'ভিআইপি মেম্বারশিপে স্বাগতম!',
      messageEn: `Your VIP membership has been created. Your membership ID is ${member.membershipId}. Admin will verify your payment shortly.`,
      messageBn: `আপনার ভিআইপি মেম্বারশিপ তৈরি হয়েছে। আপনার মেম্বারশিপ আইডি ${member.membershipId}। অ্যাডমিন শীঘ্রই আপনার পেমেন্ট ভেরিফাই করবে।`,
    });

    const affiliateOrderAmount = starterBDT + couponDiscountBDT;
    await processAffiliateReferral(
      { ...body, buyerName: userName, buyerPhone: phoneNumber, buyerTelegram: telegramUsername, source: 'vip_plan', productId: plan._id.toString(), productName: plan.titleEn, planName: isOfficial ? 'Official' : 'Starter' },
      member.membershipId,
      payment._id.toString(),
      affiliateOrderAmount,
      'BDT'
    );

    return NextResponse.json({
      success: true,
      memberId: member._id,
      accessCode: member.accessCode,
      membershipId: member.membershipId,
      userName: member.userName,
      status: member.status,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
