import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPMembershipPayment from '@/models/VIPMembershipPayment';
import VIPMembershipUser from '@/models/VIPMembershipUser';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const isApproved = body.status === 'approved' || body.verified;
    const updateData: any = { ...body };
    if (isApproved) updateData.verified = true;
    if (body.status === 'rejected') updateData.verified = false;

    const payment = await VIPMembershipPayment.findByIdAndUpdate(
      id,
      { $set: { ...updateData, verifiedAt: isApproved ? new Date() : null } },
      { new: true }
    );
    if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

    if (isApproved) {
      const member = await VIPMembershipUser.findById(payment.membershipUserId);
      if (member) {
        const newPaidBDT = member.totalPaidBDT + payment.amountBDT;
        const newPaidUSDT = member.totalPaidUSDT + payment.amountUSDT;
        const newRemainingBDT = Math.max(0, member.remainingAmountBDT - payment.amountBDT);
        const newRemainingUSDT = Math.max(0, member.remainingAmountUSDT - payment.amountUSDT);
        const progress = member.remainingAmountBDT > 0
          ? Math.min(100, Math.round((newPaidBDT / (newPaidBDT + newRemainingBDT)) * 100))
          : 100;

        const now = new Date();
        const nextDueDate = new Date(now);
        nextDueDate.setDate(nextDueDate.getDate() + 30);

        await VIPMembershipUser.findByIdAndUpdate(payment.membershipUserId, {
          $set: {
            totalPaidBDT: newPaidBDT,
            totalPaidUSDT: newPaidUSDT,
            remainingAmountBDT: newRemainingBDT,
            remainingAmountUSDT: newRemainingUSDT,
            paymentProgress: progress,
            status: newRemainingBDT <= 0 ? 'completed' : 'active',
            nextDueDate,
            lastPaymentDate: now,
          },
        });
      }
    }

    return NextResponse.json(payment);
  } catch {
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}
