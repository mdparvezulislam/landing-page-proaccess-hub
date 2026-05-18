import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPPlan from '@/models/VIPPlan';

export async function GET() {
  try {
    await connectDB();
    const plans = await VIPPlan.find().sort({ order: 1 }).lean();
    return NextResponse.json(plans);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch VIP plans' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
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
