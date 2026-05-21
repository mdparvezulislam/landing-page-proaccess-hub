import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  productName: string;
  plan: string;
  amount: number;
  customerName: string;
  telegramUsername: string;
  paymentNumber: string;
  transactionId: string;
  screenshotUrl: string;
  status: 'Pending' | 'Completed' | 'Rejected';
  couponCode: string;
  discountPercent: number;
  discountAmount: number;
  originalAmount: number;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  productName: { type: String, required: true },
  plan: { type: String, required: true },
  amount: { type: Number, required: true },
  customerName: { type: String, required: true },
  telegramUsername: { type: String, required: true },
  paymentNumber: { type: String, required: true },
  transactionId: { type: String, required: true, unique: true },
  screenshotUrl: { type: String },
  status: { type: String, enum: ['Pending', 'Completed', 'Rejected'], default: 'Pending' },
  couponCode: { type: String, default: '' },
  discountPercent: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  originalAmount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
