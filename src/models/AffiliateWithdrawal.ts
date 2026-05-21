import mongoose, { Schema, Document } from 'mongoose';

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'paid';
export type PaymentMethod = 'binance' | 'bkash' | 'nagad';

export interface IAffiliateWithdrawal extends Document {
  affiliateId: mongoose.Types.ObjectId;
  amount: number;
  currency: 'BDT' | 'USDT';
  paymentMethod: PaymentMethod;
  accountInfo: {
    accountNumber: string;
    accountHolder: string;
  };
  status: WithdrawalStatus;
  adminNote: string;
  processedAt: Date | null;
  processedBy: string;
}

const AffiliateWithdrawalSchema = new Schema<IAffiliateWithdrawal>({
  affiliateId: { type: Schema.Types.ObjectId, ref: 'AffiliateUser', required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['BDT', 'USDT'], default: 'BDT' },
  paymentMethod: { type: String, enum: ['binance', 'bkash', 'nagad'], required: true },
  accountInfo: {
    accountNumber: { type: String, required: true },
    accountHolder: { type: String, default: '' },
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'paid'], default: 'pending' },
  adminNote: { type: String, default: '' },
  processedAt: { type: Date, default: null },
  processedBy: { type: String, default: '' },
}, { timestamps: true });

AffiliateWithdrawalSchema.index({ affiliateId: 1, status: 1 });

export default mongoose.models.AffiliateWithdrawal || mongoose.model<IAffiliateWithdrawal>('AffiliateWithdrawal', AffiliateWithdrawalSchema);
