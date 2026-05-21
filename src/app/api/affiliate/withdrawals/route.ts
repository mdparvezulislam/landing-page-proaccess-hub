import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliateUser from '@/models/AffiliateUser';
import AffiliateWallet from '@/models/AffiliateWallet';
import AffiliateWithdrawal from '@/models/AffiliateWithdrawal';
import AffiliateTransaction from '@/models/AffiliateTransaction';
import AffiliateNotification from '@/models/AffiliateNotification';
import AffiliateGlobalSettings from '@/models/AffiliateGlobalSettings';
import { verifyAffiliate } from '@/lib/affiliateAuth';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const { valid, payload } = await verifyAffiliate();
    if (!valid || !payload) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const affiliateId = new mongoose.Types.ObjectId(payload.id);

    const withdrawals = await AffiliateWithdrawal.find({ affiliateId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const transactions = await AffiliateTransaction.find({ affiliateId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const wallet = await AffiliateWallet.findOne({ affiliateId }).lean() as any;
    const settings = await AffiliateGlobalSettings.findOne().lean() as any;

    return NextResponse.json({
      wallet: wallet ? {
        availableBalance: wallet.availableBalance || 0,
        pendingBalance: wallet.pendingBalance || 0,
        withdrawnBalance: wallet.withdrawnBalance || 0,
        totalEarned: wallet.totalEarned || 0,
      } : { availableBalance: 0, pendingBalance: 0, withdrawnBalance: 0, totalEarned: 0 },
      withdrawals: withdrawals.map(w => ({
        id: w._id,
        amount: w.amount,
        currency: w.currency || 'BDT',
        paymentMethod: w.paymentMethod,
        accountInfo: w.accountInfo,
        status: w.status,
        adminNote: w.adminNote,
        processedAt: w.processedAt,
        createdAt: w.createdAt,
      })),
      transactions: transactions.map(t => ({
        id: t._id,
        type: t.type,
        amount: t.amount,
        balanceBefore: t.balanceBefore,
        balanceAfter: t.balanceAfter,
        status: t.status,
        description: t.description,
        createdAt: t.createdAt,
      })),
      settings: {
        minWithdrawal: settings?.minWithdrawal || 5,
        maxWithdrawal: settings?.maxWithdrawal || 0,
        defaultCurrency: settings?.defaultCurrency || 'BDT',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { valid, payload } = await verifyAffiliate();
    if (!valid || !payload) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { amount, paymentMethod, accountNumber, accountHolder, currency } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid withdrawal amount' }, { status: 400 });
    }

    if (!paymentMethod || !accountNumber) {
      return NextResponse.json({ error: 'Payment method and account number are required' }, { status: 400 });
    }

    await connectDB();
    const affiliateId = new mongoose.Types.ObjectId(payload.id);

    const settings = await AffiliateGlobalSettings.findOne().lean() as any;
    const minW = settings?.minWithdrawal || 5;
    const maxW = settings?.maxWithdrawal || 0;
    const defaultCurrency = settings?.defaultCurrency || 'BDT';
    const withdrawalCurrency = currency || defaultCurrency;

    const wallet = await AffiliateWallet.findOne({ affiliateId });
    if (!wallet || wallet.availableBalance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    if (amount < minW) {
      return NextResponse.json({ error: `Minimum withdrawal amount is $${minW}` }, { status: 400 });
    }

    if (maxW > 0 && amount > maxW) {
      return NextResponse.json({ error: `Maximum withdrawal amount is $${maxW}` }, { status: 400 });
    }

    const withdrawal = await AffiliateWithdrawal.create({
      affiliateId,
      amount,
      currency: withdrawalCurrency,
      paymentMethod,
      accountInfo: { accountNumber, accountHolder },
      status: 'pending',
    });

    wallet.availableBalance -= amount;
    wallet.withdrawnBalance += amount;
    wallet.lastUpdated = new Date();
    await wallet.save();

    await AffiliateTransaction.create({
      affiliateId,
      type: 'withdrawal',
      amount: -amount,
      balanceBefore: wallet.availableBalance + amount,
      balanceAfter: wallet.availableBalance,
      source: { withdrawalId: withdrawal._id.toString(), note: 'Withdrawal request' },
      status: 'pending',
      description: `Withdrawal via ${paymentMethod} (${withdrawalCurrency})`,
    });

    await AffiliateNotification.create({
      affiliateId,
      type: 'admin_note',
      title: 'Withdrawal Request Submitted',
      message: `Your withdrawal request for ${withdrawalCurrency === 'BDT' ? '৳' : '$'}${amount} via ${paymentMethod} has been submitted. Admin will process it shortly.`,
    });

    return NextResponse.json({
      success: true,
      withdrawal: {
        id: withdrawal._id,
        amount: withdrawal.amount,
        currency: withdrawal.currency,
        paymentMethod: withdrawal.paymentMethod,
        status: withdrawal.status,
      },
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Withdrawal request failed' }, { status: 500 });
  }
}
