import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateUser from '@/models/AffiliateUser';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: 'No code' }, { status: 400 });

    await connectDB();
    const affiliate = await AffiliateUser.findOne({ affiliateCode: code, banned: false, status: 'active' });
    if (!affiliate) return NextResponse.json({ error: 'Invalid affiliate' }, { status: 404 });

    return NextResponse.json({ valid: true, affiliateId: affiliate._id });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
