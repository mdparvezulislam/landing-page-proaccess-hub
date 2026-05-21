import mongoose, { Schema, Document } from 'mongoose';

export type TransactionType = 'referral_commission' | 'withdrawal' | 'adjustment' | 'bonus' | 'refund_reversal';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface IAffiliateTransaction extends Document {
  affiliateId: mongoose.Types.ObjectId;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  source: {
    referralId?: string;
    withdrawalId?: string;
    note?: string;
  };
  status: TransactionStatus;
  description: string;
}

const AffiliateTransactionSchema = new Schema<IAffiliateTransaction>({
  affiliateId: { type: Schema.Types.ObjectId, ref: 'AffiliateUser', required: true, index: true },
  type: {
    type: String,
    enum: ['referral_commission', 'withdrawal', 'adjustment', 'bonus', 'refund_reversal'],
    required: true,
  },
  amount: { type: Number, required: true },
  balanceBefore: { type: Number, default: 0 },
  balanceAfter: { type: Number, default: 0 },
  source: {
    referralId: { type: String, default: '' },
    withdrawalId: { type: String, default: '' },
    note: { type: String, default: '' },
  },
  status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
  description: { type: String, default: '' },
}, { timestamps: true });

AffiliateTransactionSchema.index({ affiliateId: 1, createdAt: -1 });
AffiliateTransactionSchema.index({ affiliateId: 1, type: 1 });

export default mongoose.models.AffiliateTransaction || mongoose.model<IAffiliateTransaction>('AffiliateTransaction', AffiliateTransactionSchema);
