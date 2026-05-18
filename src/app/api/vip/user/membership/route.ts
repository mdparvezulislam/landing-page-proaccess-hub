import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPMembershipUser from '@/models/VIPMembershipUser';

export async function GET(req: Request) {
  try {
    const memberId = req.headers.get('x-member-id');
    const accessCode = req.headers.get('x-access-code');
    if (!memberId || !accessCode) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const member = await VIPMembershipUser.findById(memberId).populate('selectedVIPPlanId').lean();
    if (!member || member.accessCode !== accessCode) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    return NextResponse.json(member);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch membership' }, { status: 500 });
  }
}
