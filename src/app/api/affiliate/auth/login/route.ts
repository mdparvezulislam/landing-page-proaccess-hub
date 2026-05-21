import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateUser from '@/models/AffiliateUser';
import { comparePassword, createAffiliateToken } from '@/lib/affiliateAuth';
import AffiliateNotification from '@/models/AffiliateNotification';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await AffiliateUser.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.banned || user.status === 'banned') {
      return NextResponse.json({ error: 'Your account has been banned. Contact admin.' }, { status: 403 });
    }

    if (user.status === 'rejected') {
      return NextResponse.json({ error: 'Your affiliate application has been rejected.' }, { status: 403 });
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    user.lastLoginAt = new Date();
    await user.save();

    if (user.status === 'pending') {
      await AffiliateNotification.create({
        affiliateId: user._id,
        type: 'admin_note',
        title: 'Account Pending Approval',
        message: 'Your affiliate account is still pending approval. You will be notified once an admin activates it.',
      });
    }

    const token = createAffiliateToken({
      id: user._id.toString(),
      email: user.email,
      affiliateCode: user.affiliateCode,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        telegramUsername: user.telegramUsername,
        affiliateCode: user.affiliateCode,
        referralLink: user.referralLink,
        status: user.status,
        verified: user.verified,
        banned: user.banned,
        promotionMethod: user.promotionMethod,
        rejectionNote: user.rejectionNote,
        approvalNote: user.approvalNote,
      },
      token,
    });

    response.cookies.set('affiliate-auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
