import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPMembershipUser from '@/models/VIPMembershipUser';
import VIPMembershipPayment from '@/models/VIPMembershipPayment';
import VIPMembershipNotification from '@/models/VIPMembershipNotification';

export async function POST(req: Request) {
  try {
    const memberId = req.headers.get('x-member-id');
    const accessCode = req.headers.get('x-access-code');
    if (!memberId || !accessCode) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const member = await VIPMembershipUser.findById(memberId);
    if (!member || member.accessCode !== accessCode) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
    if (member.banned) {
      return NextResponse.json({ error: 'Membership is banned' }, { status: 403 });
    }

    const { amountBDT, amountUSDT, paymentMethod, transactionId, screenshot, note } = await req.json();
    if (!amountBDT || !transactionId) {
      return NextResponse.json({ error: 'Amount and transaction ID are required' }, { status: 400 });
    }

    const payment = await VIPMembershipPayment.create({
      membershipUserId: memberId,
      amountBDT,
      amountUSDT: amountUSDT || Math.round(amountBDT / 125),
      paymentMethod: paymentMethod || 'manual',
      transactionId,
      screenshot: screenshot || '',
      note: note || '',
      status: 'pending',
      verified: false,
    });

    await VIPMembershipUser.findByIdAndUpdate(memberId, {
      $inc: { totalPaymentsCount: 1 },
      lastPaymentDate: new Date(),
    });

    await VIPMembershipNotification.create({
      userId: memberId,
      type: 'payment_received',
      titleEn: 'Payment Submitted',
      titleBn: 'পেমেন্ট জমা দেওয়া হয়েছে',
      messageEn: `Your payment of ${amountBDT} BDT (${transactionId}) is pending admin verification.`,
      messageBn: `আপনার ${amountBDT} বিডিটি পেমেন্ট (${transactionId}) অ্যাডমিন ভেরিফিকেশন অপেক্ষাধীন।`,
    });

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to submit payment' }, { status: 500 });
  }
}
