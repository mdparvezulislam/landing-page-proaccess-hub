import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateReferral from '@/models/AffiliateReferral';
import { verifyAffiliate } from '@/lib/affiliateAuth';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    const { valid, payload } = await verifyAffiliate();
    if (!valid || !payload) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const source = searchParams.get('source');

    await connectDB();
    const affiliateId = new mongoose.Types.ObjectId(payload.id);

    const filter: any = { affiliateId };
    if (status) filter.orderStatus = status;
    if (source) filter.source = source;

    const total = await AffiliateReferral.countDocuments(filter);
    const referrals = await AffiliateReferral.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      referrals: referrals.map(r => ({
        id: r._id,
        buyerName: r.buyerName,
        buyerPhone: r.buyerPhone,
        buyerEmail: r.buyerEmail,
        source: r.source,
        productName: r.productName,
        planName: r.planName,
        orderAmount: r.orderAmount,
        discountAmount: r.discountAmount,
        commissionAmount: r.commissionAmount,
        currency: r.currency,
        orderStatus: r.orderStatus,
        commissionStatus: r.commissionStatus,
        couponCode: r.couponCode,
        createdAt: r.createdAt,
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
  }
}
