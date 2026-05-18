import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPMembershipUser from '@/models/VIPMembershipUser';

export async function GET() {
  try {
    await connectDB();
    const members = await VIPMembershipUser.find()
      .populate('selectedVIPPlanId')
      .sort({ joinedAt: -1 })
      .lean();
    return NextResponse.json(members);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch VIP members' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const member = await VIPMembershipUser.create(body);
    return NextResponse.json(member, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create VIP member' }, { status: 500 });
  }
}
