import mongoose, { Schema, Document } from 'mongoose';

export type VIPMembershipStatus = 'active' | 'pending' | 'overdue' | 'banned' | 'completed';

export interface IVIPMembershipUser extends Document {
  userName: string;
  phoneNumber: string;
  telegramUsername: string;
  telegramId: string;
  accessCode: string;
  membershipId: string;
  selectedVIPPlanId: mongoose.Types.ObjectId;
  membershipType: 'starter' | 'premium';
  totalPaidBDT: number;
  totalPaidUSDT: number;
  remainingAmountBDT: number;
  remainingAmountUSDT: number;
  monthlyBDT: number;
  monthlyUSDT: number;
  nextDueAmountBDT: number;
  nextDueAmountUSDT: number;
  nextDueDate: Date;
  paymentProgress: number;
  totalPaymentsCount: number;
  completedPaymentsCount: number;
  status: VIPMembershipStatus;
  banned: boolean;
  banReason: string;
  joinedAt: Date;
  lastPaymentDate: Date | null;
  dashboardEnabled: boolean;
  adminNote: string;
  couponCode: string;
  discountPercent: number;
  discountAmount: number;
}

function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateMembershipId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VIP-${ts}-${rand}`;
}

const VIPMembershipUserSchema = new Schema<IVIPMembershipUser>({
  userName: { type: String, required: true },
  phoneNumber: { type: String, default: '' },
  telegramUsername: { type: String, default: '' },
  telegramId: { type: String, default: '' },
  accessCode: { type: String, default: generateAccessCode, unique: true, index: true },
  membershipId: { type: String, default: generateMembershipId, unique: true, index: true },
  selectedVIPPlanId: { type: Schema.Types.ObjectId, ref: 'VIPPlan', required: true, index: true },
  membershipType: { type: String, enum: ['starter', 'premium'], default: 'premium' },
  totalPaidBDT: { type: Number, default: 0 },
  totalPaidUSDT: { type: Number, default: 0 },
  remainingAmountBDT: { type: Number, default: 0 },
  remainingAmountUSDT: { type: Number, default: 0 },
  monthlyBDT: { type: Number, default: 0 },
  monthlyUSDT: { type: Number, default: 0 },
  nextDueAmountBDT: { type: Number, default: 0 },
  nextDueAmountUSDT: { type: Number, default: 0 },
  nextDueDate: { type: Date, required: true },
  paymentProgress: { type: Number, default: 0 },
  totalPaymentsCount: { type: Number, default: 0 },
  completedPaymentsCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'pending', 'overdue', 'banned', 'completed'],
    default: 'pending',
  },
  banned: { type: Boolean, default: false },
  banReason: { type: String, default: '' },
  joinedAt: { type: Date, default: Date.now },
  lastPaymentDate: { type: Date, default: null },
  dashboardEnabled: { type: Boolean, default: true },
  adminNote: { type: String, default: '' },
  couponCode: { type: String, default: '' },
  discountPercent: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.VIPMembershipUser || mongoose.model<IVIPMembershipUser>('VIPMembershipUser', VIPMembershipUserSchema);
