import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPMembershipReminder from '@/models/VIPMembershipReminder';

export async function GET() {
  try {
    await connectDB();
    const reminders = await VIPMembershipReminder.find()
      .populate('userId')
      .sort({ sentAt: -1 })
      .lean();
    return NextResponse.json(reminders);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const reminder = await VIPMembershipReminder.create(body);
    return NextResponse.json(reminder, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
  }
}
