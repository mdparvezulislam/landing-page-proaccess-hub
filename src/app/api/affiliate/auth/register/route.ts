import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateUser from '@/models/AffiliateUser';
import AffiliateCoupon from '@/models/AffiliateCoupon';
import AffiliateWallet from '@/models/AffiliateWallet';
import AffiliateNotification from '@/models/AffiliateNotification';
import { hashPassword, createAffiliateToken } from '@/lib/affiliateAuth';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { fullName, email, telegramUsername, password, promotionMethod, referredBy } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Full name, email, and password are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await AffiliateUser.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    const codeBase = fullName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toLowerCase();
    const rand = Math.random().toString(36).substring(2, 5);
    const affiliateCode = `${codeBase}${rand}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://proaccessvip.com';
    const referralLink = `${siteUrl}/affiliate/register?ref=${affiliateCode}`;

    let referredById = '';
    if (referredBy) {
      const referrer = await AffiliateUser.findOne({ affiliateCode: referredBy });
      if (referrer) {
        referredById = referrer._id.toString();
      }
    }

    const user = await AffiliateUser.create({
      fullName,
      email: email.toLowerCase(),
      telegramUsername: telegramUsername || '',
      passwordHash,
      affiliateCode,
      referralLink,
      status: 'pending',
      ipAddress: ip,
      promotionMethod: promotionMethod || '',
      referredBy: referredById,
    });

    await AffiliateCoupon.create({
      affiliateId: user._id,
      couponCode: `${fullName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase()}${Math.floor(Math.random() * 9) + 1}`,
      discountPercent: 5,
      commissionPercent: 20,
      usageLimit: 0,
      active: true,
    });

    await AffiliateWallet.create({
      affiliateId: user._id,
      availableBalance: 0,
      pendingBalance: 0,
      withdrawnBalance: 0,
      lifetimeEarnings: 0,
    });

    await AffiliateNotification.create({
      affiliateId: user._id,
      type: 'welcome',
      title: 'Welcome to the Affiliate Program!',
      message: 'Your account is pending approval. You will be notified once approved.',
    });

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
        affiliateCode: user.affiliateCode,
        referralLink: user.referralLink,
        status: user.status,
        promotionMethod: user.promotionMethod,
      },
      token,
    }, { status: 201 });

    response.cookies.set('affiliate-auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json({ error: 'Email or affiliate code already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
