import mongoose, { Schema, Document } from 'mongoose';

export interface IAffiliateUser extends Document {
  fullName: string;
  email: string;
  telegramUsername: string;
  passwordHash: string;
  affiliateCode: string;
  referralLink: string;
  status: 'pending' | 'active' | 'rejected' | 'suspended' | 'banned';
  totalReferrals: number;
  totalSales: number;
  totalCommission: number;
  availableBalance: number;
  pendingBalance: number;
  withdrawnBalance: number;
  lifetimeEarnings: number;
  joinedAt: Date;
  banned: boolean;
  banReason: string;
  verified: boolean;
  lastLoginAt: Date | null;
  paymentInfo: {
    binance: string;
    bkash: string;
    nagad: string;
  };
  ipAddress: string;
  promotionMethod: string;
  rejectionNote: string;
  approvalNote: string;
}

function generateAffiliateCode(name: string): string {
  const prefix = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toLowerCase();
  const rand = Math.random().toString(36).substring(2, 5);
  return `${prefix}${rand}`;
}

const AffiliateUserSchema = new Schema<IAffiliateUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  telegramUsername: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  affiliateCode: { type: String, default: () => generateAffiliateCode('aff'), unique: true, index: true },
  referralLink: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'active', 'rejected', 'suspended', 'banned'], default: 'pending' },
  totalReferrals: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  totalCommission: { type: Number, default: 0 },
  availableBalance: { type: Number, default: 0 },
  pendingBalance: { type: Number, default: 0 },
  withdrawnBalance: { type: Number, default: 0 },
  lifetimeEarnings: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
  banned: { type: Boolean, default: false },
  banReason: { type: String, default: '' },
  verified: { type: Boolean, default: false },
  lastLoginAt: { type: Date, default: null },
  paymentInfo: {
    binance: { type: String, default: '' },
    bkash: { type: String, default: '' },
    nagad: { type: String, default: '' },
  },
  ipAddress: { type: String, default: '' },
  promotionMethod: { type: String, default: '' },
  rejectionNote: { type: String, default: '' },
  approvalNote: { type: String, default: '' },
}, { timestamps: true });

AffiliateUserSchema.pre('save', function () {
  if (this.affiliateCode && !this.referralLink) {
    this.referralLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://proaccessvip.com'}?ref=${this.affiliateCode}`;
  }
});

export default mongoose.models.AffiliateUser || mongoose.model<IAffiliateUser>('AffiliateUser', AffiliateUserSchema);
