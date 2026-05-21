import mongoose, { Schema, Document } from 'mongoose';

export interface IAffiliateWallet extends Document {
  affiliateId: mongoose.Types.ObjectId;
  availableBalance: number;
  pendingBalance: number;
  withdrawnBalance: number;
  lifetimeEarnings: number;
  lastUpdated: Date;
}

const AffiliateWalletSchema = new Schema<IAffiliateWallet>({
  affiliateId: { type: Schema.Types.ObjectId, ref: 'AffiliateUser', required: true, unique: true, index: true },
  availableBalance: { type: Number, default: 0 },
  pendingBalance: { type: Number, default: 0 },
  withdrawnBalance: { type: Number, default: 0 },
  lifetimeEarnings: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.AffiliateWallet || mongoose.model<IAffiliateWallet>('AffiliateWallet', AffiliateWalletSchema);
