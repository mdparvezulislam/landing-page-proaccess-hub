import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateUser from '@/models/AffiliateUser';
import AffiliateWallet from '@/models/AffiliateWallet';
import AffiliateNotification from '@/models/AffiliateNotification';
import { verifyAdmin } from '@/lib/adminAuth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    await connectDB();

    const prevUser = await AffiliateUser.findById(id);
    if (!prevUser) return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });

    const updateData: any = {};
    if (body.status) updateData.status = body.status;
    if (body.verified !== undefined) updateData.verified = body.verified;
    if (body.promotionMethod) updateData.promotionMethod = body.promotionMethod;

    const note = body.note || '';
    const reason = body.reason || '';

    const user = await AffiliateUser.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select('-passwordHash');

    if (body.status === 'active' && prevUser.status === 'pending') {
      await AffiliateUser.findByIdAndUpdate(id, { $set: { approvalNote: note || 'Welcome to Pro Access Affiliate Program!' } });
      await AffiliateNotification.create({
        affiliateId: id,
        type: 'account_approved',
        title: 'Account Approved!',
        message: note || 'Your affiliate account has been approved. You can now start sharing your referral link and earning commissions!',
      });
    }

    if (body.status === 'rejected') {
      await AffiliateUser.findByIdAndUpdate(id, { $set: { rejectionNote: note || 'Please provide more promotion details' } });
      await AffiliateNotification.create({
        affiliateId: id,
        type: 'account_rejected',
        title: 'Application Rejected',
        message: note || 'Your affiliate application has been rejected. Contact admin for more information.',
      });
    }

    if (body.status === 'banned') {
      await AffiliateUser.findByIdAndUpdate(id, { $set: { banReason: reason || 'Violation of terms' } });
      await AffiliateNotification.create({
        affiliateId: id,
        type: 'admin_note',
        title: 'Account Banned',
        message: reason || 'Your account has been banned. Contact admin for details.',
      });
    }

    if (body.status === 'active' && prevUser.status === 'suspended') {
      await AffiliateNotification.create({
        affiliateId: id,
        type: 'account_approved',
        title: 'Account Reinstated',
        message: note || 'Your affiliate account has been reinstated. You can resume sharing your referral link.',
      });
    }

    if (body.status === 'active' && prevUser.status === 'banned') {
      await AffiliateUser.findByIdAndUpdate(id, { $set: { banReason: '' } });
      await AffiliateNotification.create({
        affiliateId: id,
        type: 'account_approved',
        title: 'Account Unbanned',
        message: note || 'Your account has been unbanned. You can resume your affiliate activities.',
      });
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Failed to update affiliate' }, { status: 500 });
  }
}
