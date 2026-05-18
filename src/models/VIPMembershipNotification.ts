import mongoose, { Schema, Document } from 'mongoose';

export type VIPNotificationType = 'payment_received' | 'payment_verified' | 'payment_due' | 'overdue' | 'membership_paused' | 'membership_banned' | 'membership_activated' | 'admin_note';

export interface IVIPMembershipNotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: VIPNotificationType;
  titleEn: string;
  titleBn: string;
  messageEn: string;
  messageBn: string;
  read: boolean;
  readAt: Date | null;
}

const VIPMembershipNotificationSchema = new Schema<IVIPMembershipNotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'VIPMembershipUser', required: true, index: true },
  type: {
    type: String,
    enum: ['payment_received', 'payment_verified', 'payment_due', 'overdue', 'membership_paused', 'membership_banned', 'membership_activated', 'admin_note'],
    required: true,
  },
  titleEn: { type: String, required: true },
  titleBn: { type: String, required: true },
  messageEn: { type: String, default: '' },
  messageBn: { type: String, default: '' },
  read: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.models.VIPMembershipNotification || mongoose.model<IVIPMembershipNotification>('VIPMembershipNotification', VIPMembershipNotificationSchema);
