import mongoose, { Schema, Document } from 'mongoose';

export interface IAffiliateCoupon extends Document {
  couponCode: string;
  affiliateId: mongoose.Types.ObjectId;
  discountPercent: number;
  commissionPercent: number;
  usageLimit: number;
  totalUsed: number;
  active: boolean;
  expireDate: Date | null;
}

function generateCouponCode(name: string): string {
  const prefix = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 6).toUpperCase();
  const digit = Math.floor(Math.random() * 9) + 1;
  return `${prefix}${digit}`;
}

const AffiliateCouponSchema = new Schema<IAffiliateCoupon>({
  couponCode: { type: String, default: () => generateCouponCode('AFF'), unique: true, index: true },
  affiliateId: { type: Schema.Types.ObjectId, ref: 'AffiliateUser', required: true, index: true },
  discountPercent: { type: Number, default: 5 },
  commissionPercent: { type: Number, default: 20 },
  usageLimit: { type: Number, default: 0 },
  totalUsed: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  expireDate: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.models.AffiliateCoupon || mongoose.model<IAffiliateCoupon>('AffiliateCoupon', AffiliateCouponSchema);
