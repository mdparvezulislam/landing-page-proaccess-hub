import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPPlan from '@/models/VIPPlan';

export async function GET() {
  try {
    await connectDB();
    const plans = await VIPPlan.find().sort({ order: 1 });
    return NextResponse.json(plans);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch VIP plans' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (body.enableDiscount && body.discountPercent > 0 && body.officialPriceBDT) {
      body.discountPriceBDT = Math.round(body.officialPriceBDT * (1 - body.discountPercent / 100));
    }
    if (body.enableDiscount && body.discountPercent > 0 && body.officialPriceUSDT) {
      body.discountPriceUSDT = Math.round(body.officialPriceUSDT * (1 - body.discountPercent / 100));
    }

    if (body.starterEnableDiscount && body.starterDiscountPercent > 0 && body.starterOfficialBDT) {
      body.starterDiscountPriceBDT = Math.round(body.starterOfficialBDT * (1 - body.starterDiscountPercent / 100));
    }
    if (body.starterEnableDiscount && body.starterDiscountPercent > 0 && body.starterOfficialUSDT) {
      body.starterDiscountPriceUSDT = Math.round(body.starterOfficialUSDT * (1 - body.starterDiscountPercent / 100));
    }

    const plan = await VIPPlan.findByIdAndUpdate(
      body._id,
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    );
    return NextResponse.json(plan);
  } catch {
    return NextResponse.json({ error: 'Failed to save VIP plan' }, { status: 500 });
  }
}
