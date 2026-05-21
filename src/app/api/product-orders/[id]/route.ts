import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProductOrder from '@/models/ProductOrder';
import { verifyAdmin } from '@/lib/adminAuth';
import AffiliateReferral from '@/models/AffiliateReferral';
import AffiliateUser from '@/models/AffiliateUser';
import AffiliateWallet from '@/models/AffiliateWallet';
import AffiliateTransaction from '@/models/AffiliateTransaction';
import AffiliateNotification from '@/models/AffiliateNotification';

async function processCommissionForProductOrder(order: any) {
  try {
    const referral = await AffiliateReferral.findOne({ orderId: order._id.toString() });
    if (!referral || referral.commissionStatus !== 'pending') return;

    referral.orderStatus = 'completed';
    referral.commissionStatus = 'pending';
    await referral.save();

    const wallet = await AffiliateWallet.findOne({ affiliateId: referral.affiliateId });
    if (wallet) {
      wallet.pendingBalance += referral.commissionAmount;
      wallet.lifetimeEarnings += referral.commissionAmount;
      wallet.lastUpdated = new Date();
      await wallet.save();
    }

    await AffiliateUser.findByIdAndUpdate(referral.affiliateId, {
      $inc: { totalSales: 1, totalCommission: referral.commissionAmount, pendingBalance: referral.commissionAmount, lifetimeEarnings: referral.commissionAmount },
    });

    await AffiliateTransaction.create({
      affiliateId: referral.affiliateId,
      type: 'referral_commission',
      amount: referral.commissionAmount,
      source: { referralId: referral._id.toString(), note: 'Commission from product order approval' },
      status: 'pending',
      description: `Commission for ${referral.productName}`,
    });

    await AffiliateNotification.create({
      affiliateId: referral.affiliateId,
      type: 'new_commission',
      title: 'New Commission!',
      message: `Product sale completed! You earned $${referral.commissionAmount.toFixed(2)} commission.`,
    });
  } catch (err) {
    console.error('Commission processing error:', err);
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const order = await ProductOrder.findById(id);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    await connectDB();
    const data = await req.json();

    const prevOrder = await ProductOrder.findById(id);

    if (data.status === 'active' && !data.activatedAt) {
      data.activatedAt = new Date();
    }
    if (data.status === 'completed') {
      data.completedAt = new Date();
    }
    if (data.status === 'cancelled') {
      data.cancelledAt = new Date();
    }
    if (data.action === 'ban') {
      data.banned = true;
      data.bannedAt = new Date();
      data.banReason = data.banReason || '';
      delete data.action;
    }
    if (data.action === 'unban') {
      data.banned = false;
      data.bannedAt = null;
      data.banReason = '';
      delete data.action;
    }

    const order = await ProductOrder.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    if ((data.status === 'active' || data.status === 'completed') && prevOrder && (prevOrder.status !== 'active' && prevOrder.status !== 'completed')) {
      await processCommissionForProductOrder(order);
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    await connectDB();
    await ProductOrder.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
