import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPMembershipUser from '@/models/VIPMembershipUser';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { credential } = await req.json();
    if (!credential) {
      return NextResponse.json({ error: 'Credential is required' }, { status: 400 });
    }

    const member = await VIPMembershipUser.findOne({
      $or: [
        { telegramUsername: credential },
        { membershipId: credential },
        { accessCode: credential },
      ],
    }).populate('selectedVIPPlanId').lean();

    if (!member) {
      return NextResponse.json({ error: 'No membership found with that credential' }, { status: 404 });
    }

    if (member.banned) {
      return NextResponse.json({ error: 'Your membership has been banned', banReason: member.banReason }, { status: 403 });
    }

    return NextResponse.json({
      memberId: member._id,
      accessCode: member.accessCode,
      membershipId: member.membershipId,
      userName: member.userName,
      telegramUsername: member.telegramUsername,
      status: member.status,
    });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
