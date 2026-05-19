import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPPlan from '@/models/VIPPlan';
import VIPMembershipUser from '@/models/VIPMembershipUser';
import VIPMembershipPayment from '@/models/VIPMembershipPayment';
import VIPMembershipNotification from '@/models/VIPMembershipNotification';

function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { userName, phoneNumber, telegramUsername, telegramId, transactionId, screenshot, note, pricingTrack, paymentMethod, paymentMethodId } = body;

    if (!userName) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const bannedWithPhone = await VIPMembershipUser.findOne({ phoneNumber, banned: true });
    if (bannedWithPhone) {
      return NextResponse.json({ error: 'This phone number has been banned. Cannot place order.' }, { status: 403 });
    }

    const plan = await VIPPlan.findOne({ featured: true, visible: true });
    if (!plan) {
      return NextResponse.json({ error: 'No active VIP plan found' }, { status: 404 });
    }

    const isOfficial = pricingTrack === 'official';

    const starterBDT = isOfficial ? plan.officialStarterBDT : plan.starterPriceBDT;
    const starterUSDT = isOfficial ? plan.officialStarterUSDT : plan.starterPriceUSDT;
    const monthlyBDT = isOfficial ? plan.officialMonthlyBDT : plan.starterMonthlyBDT;
    const monthlyUSDT = isOfficial ? plan.officialMonthlyUSDT : plan.starterMonthlyUSDT;
    const totalBDT = starterBDT + (monthlyBDT * 12);
    const totalUSDT = starterUSDT + (monthlyUSDT * 12);

    const now = new Date();
    const nextDueDate = new Date(now);
    nextDueDate.setDate(nextDueDate.getDate() + 30);

    const accessCode = generateAccessCode();

    const member = await VIPMembershipUser.create({
      userName: userName || 'Member',
      phoneNumber: phoneNumber || '',
      telegramUsername: telegramUsername || '',
      telegramId: telegramId || '',
      accessCode,
      selectedVIPPlanId: plan._id,
      membershipType: isOfficial ? 'premium' : 'starter',
      totalPaidBDT: 0,
      totalPaidUSDT: 0,
      remainingAmountBDT: totalBDT,
      remainingAmountUSDT: totalUSDT,
      nextDueAmountBDT: starterBDT,
      nextDueAmountUSDT: starterUSDT,
      nextDueDate,
      paymentProgress: 0,
      totalPaymentsCount: 1,
      completedPaymentsCount: 0,
      status: 'pending',
      lastPaymentDate: new Date(),
      dashboardEnabled: true,
    });

    await VIPMembershipPayment.create({
      membershipUserId: member._id,
      amountBDT: starterBDT,
      amountUSDT: starterUSDT,
      paymentMethod: paymentMethod || 'manual',
      paymentMethodId: paymentMethodId || '',
      transactionId: transactionId || `MANUAL-${Date.now()}`,
      screenshot: screenshot || '',
      note: note || 'Initial joining payment',
      status: 'pending',
      verified: false,
    });

    await VIPMembershipNotification.create({
      userId: member._id,
      type: 'membership_activated',
      titleEn: 'Welcome to VIP Membership!',
      titleBn: 'ভিআইপি মেম্বারশিপে স্বাগতম!',
      messageEn: `Your VIP membership has been created. Your membership ID is ${member.membershipId}. Admin will verify your payment shortly.`,
      messageBn: `আপনার ভিআইপি মেম্বারশিপ তৈরি হয়েছে। আপনার মেম্বারশিপ আইডি ${member.membershipId}। অ্যাডমিন শীঘ্রই আপনার পেমেন্ট ভেরিফাই করবে।`,
    });

    return NextResponse.json({
      success: true,
      memberId: member._id,
      accessCode: member.accessCode,
      membershipId: member.membershipId,
      userName: member.userName,
      status: member.status,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
