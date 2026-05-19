import mongoose, { Schema, Document } from 'mongoose';

export type ProductOrderStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'refunded';

export interface IProductOrder extends Document {
  customerName: string;
  phoneNumber: string;
  telegramUsername: string;
  email: string;
  productId: mongoose.Types.ObjectId;
  productTitleEn: string;
  productTitleBn: string;
  planId: string;
  planNameEn: string;
  planNameBn: string;
  priceBDT: number;
  priceUSDT: number;
  currency: string;
  transactionId: string;
  paymentMethod: string;
  screenshot: string;
  note: string;
  status: ProductOrderStatus;
  joinedAt: Date;
  activatedAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  cancelledReason: string;
  adminNote: string;
  duration: string;
  expiresAt: Date | null;
  banned: boolean;
  bannedAt: Date | null;
  banReason: string;
}

const ProductOrderSchema = new Schema<IProductOrder>({
  customerName: { type: String, required: true },
  phoneNumber: { type: String, default: '' },
  telegramUsername: { type: String, default: '' },
  email: { type: String, default: '' },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  productTitleEn: { type: String, default: '' },
  productTitleBn: { type: String, default: '' },
  planId: { type: String, default: '' },
  planNameEn: { type: String, default: '' },
  planNameBn: { type: String, default: '' },
  priceBDT: { type: Number, default: 0 },
  priceUSDT: { type: Number, default: 0 },
  currency: { type: String, default: 'BDT' },
  transactionId: { type: String, required: true },
  paymentMethod: { type: String, default: 'manual' },
  screenshot: { type: String, default: '' },
  note: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled', 'refunded'],
    default: 'pending',
  },
  joinedAt: { type: Date, default: Date.now },
  activatedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  cancelledAt: { type: Date, default: null },
  cancelledReason: { type: String, default: '' },
  adminNote: { type: String, default: '' },
  duration: { type: String, default: 'Lifetime' },
  expiresAt: { type: Date, default: null },
  banned: { type: Boolean, default: false },
  bannedAt: { type: Date, default: null },
  banReason: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.ProductOrder || mongoose.model<IProductOrder>('ProductOrder', ProductOrderSchema);
