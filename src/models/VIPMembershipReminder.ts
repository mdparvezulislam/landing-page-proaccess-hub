import mongoose, { Schema, Document } from 'mongoose';

export interface IVIPMembershipReminder extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'due_payment' | 'overdue' | 'ban_warning' | 'banned';
  sentAt: Date;
  sentVia: 'telegram' | 'sms' | 'manual';
  message: string;
  acknowledged: boolean;
  acknowledgedAt: Date | null;
}

const VIPMembershipReminderSchema = new Schema<IVIPMembershipReminder>({
  userId: { type: Schema.Types.ObjectId, ref: 'VIPMembershipUser', required: true, index: true },
  type: {
    type: String,
    enum: ['due_payment', 'overdue', 'ban_warning', 'banned'],
    required: true,
  },
  sentAt: { type: Date, default: Date.now },
  sentVia: {
    type: String,
    enum: ['telegram', 'sms', 'manual'],
    default: 'manual',
  },
  message: { type: String, default: '' },
  acknowledged: { type: Boolean, default: false },
  acknowledgedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.models.VIPMembershipReminder || mongoose.model<IVIPMembershipReminder>('VIPMembershipReminder', VIPMembershipReminderSchema);
