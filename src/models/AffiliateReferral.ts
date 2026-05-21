import mongoose, { Schema, Document } from 'mongoose';

export interface IAffiliateReferral extends Document {
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerTelegram: string;
  affiliateId: mongoose.Types.ObjectId;
  couponCode: string;
  discountPercent: number;
  commissionPercent: number;
  source: 'vip_plan' | 'product';
  productId: string;
  productName: string;
  planName: string;
  orderAmount: number;
  discountAmount: number;
  commissionAmount: number;
  currency: 'BDT' | 'USDT';
  orderId: string;
  paymentId: string;
  orderStatus: 'pending' | 'completed' | 'cancelled' | 'refunded';
  commissionStatus: 'pending' | 'approved' | 'paid';
  ipAddress: string;
  userAgent: string;
  referrer: string;
  commissionApprovedAt: Date | null;
  paidAt: Date | null;
}

const AffiliateReferralSchema = new Schema<IAffiliateReferral>({
  buyerName: { type: String, default: '' },
  buyerPhone: { type: String, default: '' },
  buyerEmail: { type: String, default: '' },
  buyerTelegram: { type: String, default: '' },
  affiliateId: { type: Schema.Types.ObjectId, ref: 'AffiliateUser', required: true, index: true },
  couponCode: { type: String, default: '' },
  discountPercent: { type: Number, default: 5 },
  commissionPercent: { type: Number, default: 20 },
  source: { type: String, enum: ['vip_plan', 'product'], required: true },
  productId: { type: String, default: '' },
  productName: { type: String, default: '' },
  planName: { type: String, default: '' },
  orderAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  commissionAmount: { type: Number, default: 0 },
  currency: { type: String, enum: ['BDT', 'USDT'], default: 'BDT' },
  orderId: { type: String, default: '' },
  paymentId: { type: String, default: '' },
  orderStatus: { type: String, enum: ['pending', 'completed', 'cancelled', 'refunded'], default: 'pending' },
  commissionStatus: { type: String, enum: ['pending', 'approved', 'paid'], default: 'pending' },
  ipAddress: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  referrer: { type: String, default: '' },
  commissionApprovedAt: { type: Date, default: null },
  paidAt: { type: Date, default: null },
}, { timestamps: true });

AffiliateReferralSchema.index({ affiliateId: 1, commissionStatus: 1 });
AffiliateReferralSchema.index({ orderId: 1 });

export default mongoose.models.AffiliateReferral || mongoose.model<IAffiliateReferral>('AffiliateReferral', AffiliateReferralSchema);
