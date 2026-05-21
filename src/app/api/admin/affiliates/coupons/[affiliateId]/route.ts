import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateCoupon from '@/models/AffiliateCoupon';
import { verifyAdmin } from '@/lib/adminAuth';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: Promise<{ affiliateId: string }> }) {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { affiliateId } = await params;
    await connectDB();

    const coupon = await AffiliateCoupon.findOne({ affiliateId: new mongoose.Types.ObjectId(affiliateId) }).lean();

    if (!coupon) {
      return NextResponse.json({ error: 'No coupon found for this affiliate' }, { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch coupon' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ affiliateId: string }> }) {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { affiliateId } = await params;
    const body = await req.json();

    await connectDB();

    const coupon = await AffiliateCoupon.findOne({ affiliateId: new mongoose.Types.ObjectId(affiliateId) });
    if (!coupon) {
      return NextResponse.json({ error: 'No coupon found for this affiliate' }, { status: 404 });
    }

    const allowed = ['couponCode', 'discountPercent', 'commissionPercent', 'usageLimit', 'active', 'expireDate'];
    const updateData: any = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }

    if (body.couponCode) {
      const existing = await AffiliateCoupon.findOne({ couponCode: body.couponCode.toUpperCase(), _id: { $ne: coupon._id } });
      if (existing) {
        return NextResponse.json({ error: 'Coupon code already in use' }, { status: 409 });
      }
      updateData.couponCode = body.couponCode.toUpperCase();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    await AffiliateCoupon.findByIdAndUpdate(coupon._id, { $set: updateData });

    const updated = await AffiliateCoupon.findById(coupon._id).lean();
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}
