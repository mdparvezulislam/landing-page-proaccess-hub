import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FlashOffer from '@/models/FlashOffer';

export async function GET() {
  try {
    await connectDB();
    const now = new Date();

    const expiredOffers = await FlashOffer.find({
      expired: false,
      endDate: { $lt: now },
    });

    for (const offer of expiredOffers) {
      offer.expired = true;
      await offer.save();
    }

    const activeOffers = await FlashOffer.find({
      visible: true,
      expired: false,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ order: 1 });

    return NextResponse.json(activeOffers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
