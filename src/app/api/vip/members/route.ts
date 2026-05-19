import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPMembershipUser from '@/models/VIPMembershipUser';
import { verifyAdmin } from '@/lib/adminAuth';

export async function DELETE(req: Request) {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }
    await connectDB();
    await VIPMembershipUser.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ message: `${ids.length} members deleted` });
  } catch {
    return NextResponse.json({ error: 'Failed to delete members' }, { status: 500 });
  }
}

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
