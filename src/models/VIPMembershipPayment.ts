import mongoose, { Schema, Document } from 'mongoose';

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface IVIPMembershipPayment extends Document {
  membershipUserId: mongoose.Types.ObjectId;
  amountBDT: number;
  amountUSDT: number;
  paymentMethod: string;
  transactionId: string;
  screenshot: string;
  note: string;
  paymentDate: Date;
  status: PaymentStatus;
  verified: boolean;
  verifiedBy: string;
  rejectionReason: string;
  adminNote: string;
}

const VIPMembershipPaymentSchema = new Schema<IVIPMembershipPayment>({
  membershipUserId: { type: Schema.Types.ObjectId, ref: 'VIPMembershipUser', required: true, index: true },
  amountBDT: { type: Number, required: true },
  amountUSDT: { type: Number, default: 0 },
  paymentMethod: { type: String, default: '' },
  transactionId: { type: String, required: true },
  screenshot: { type: String, default: '' },
  note: { type: String, default: '' },
  paymentDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  verified: { type: Boolean, default: false },
  verifiedBy: { type: String, default: '' },
  rejectionReason: { type: String, default: '' },
  adminNote: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.VIPMembershipPayment || mongoose.model<IVIPMembershipPayment>('VIPMembershipPayment', VIPMembershipPaymentSchema);
