import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateUser from '@/models/AffiliateUser';
import AffiliateCoupon from '@/models/AffiliateCoupon';
import AffiliateReferral from '@/models/AffiliateReferral';
import AffiliateNotification from '@/models/AffiliateNotification';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { buyerName, buyerPhone, buyerEmail, buyerTelegram, couponCode, source, productId, productName, planName, orderAmount, currency, orderId, paymentId } = body;

    if (!source || !orderAmount) {
      return NextResponse.json({ error: 'Source and order amount are required' }, { status: 400 });
    }

    await connectDB();

    let affiliateCode: string | null = null;
    let discountPercent = 0;
    let commissionPercent = 20;
    let affiliateId: string | null = null;

    const refFromCookie = body.affiliateCode;

    if (couponCode) {
      const coupon = await AffiliateCoupon.findOne({ couponCode: couponCode.toUpperCase(), active: true });
      if (coupon) {
        const affiliate = await AffiliateUser.findById(coupon.affiliateId);
        if (affiliate && !affiliate.banned && affiliate.status === 'active') {
          affiliateCode = affiliate.affiliateCode;
          discountPercent = coupon.discountPercent;
          commissionPercent = coupon.commissionPercent;
          affiliateId = affiliate._id.toString();
          coupon.totalUsed += 1;
          await coupon.save();
        }
      }
    }

    if (!affiliateCode && refFromCookie) {
      const affiliate = await AffiliateUser.findOne({ affiliateCode: refFromCookie, banned: false, status: 'active' });
      if (affiliate) {
        affiliateCode = affiliate.affiliateCode;
        discountPercent = 5;
        commissionPercent = 20;
        affiliateId = affiliate._id.toString();
      }
    }

    if (!affiliateId) {
      return NextResponse.json({ noAffiliate: true, message: 'No valid affiliate found' });
    }

    const discountAmount = (orderAmount * discountPercent) / 100;
    const commissionAmount = (orderAmount * commissionPercent) / 100;

    const existing = await AffiliateReferral.findOne({ orderId });
    if (existing) {
      return NextResponse.json({ noAffiliate: true, message: 'Referral already recorded' });
    }

    const referral = await AffiliateReferral.create({
      buyerName: buyerName || '',
      buyerPhone: buyerPhone || '',
      buyerEmail: buyerEmail || '',
      buyerTelegram: buyerTelegram || '',
      affiliateId,
      couponCode: couponCode || '',
      discountPercent,
      commissionPercent,
      source,
      productId: productId || '',
      productName: productName || '',
      planName: planName || '',
      orderAmount,
      discountAmount,
      commissionAmount,
      currency: currency || 'BDT',
      orderId: orderId || '',
      paymentId: paymentId || '',
      orderStatus: 'pending',
      commissionStatus: 'pending',
    });

    await AffiliateUser.findByIdAndUpdate(affiliateId, {
      $inc: { totalReferrals: 1 },
    });

    await AffiliateNotification.create({
      affiliateId,
      type: 'referral_converted',
      title: 'New Referral!',
      message: `Someone purchased ${productName} using your referral link. Commission: $${commissionAmount.toFixed(2)} (pending approval).`,
    });

    return NextResponse.json({
      success: true,
      referral: {
        id: referral._id,
        affiliateId,
        discountPercent,
        commissionPercent,
        discountAmount,
        commissionAmount,
        orderAmount,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create referral' }, { status: 500 });
  }
}
