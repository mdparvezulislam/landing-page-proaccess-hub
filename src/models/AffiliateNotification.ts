import mongoose, { Schema, Document } from 'mongoose';

export type AffNotificationType = 'new_commission' | 'withdrawal_approved' | 'withdrawal_rejected' | 'referral_converted' | 'coupon_used' | 'admin_note' | 'account_approved' | 'account_rejected' | 'welcome';

export interface IAffiliateNotification extends Document {
  affiliateId: mongoose.Types.ObjectId;
  type: AffNotificationType;
  title: string;
  message: string;
  read: boolean;
  readAt: Date | null;
}

const AffiliateNotificationSchema = new Schema<IAffiliateNotification>({
  affiliateId: { type: Schema.Types.ObjectId, ref: 'AffiliateUser', required: true, index: true },
  type: {
    type: String,
    enum: ['new_commission', 'withdrawal_approved', 'withdrawal_rejected', 'referral_converted', 'coupon_used', 'admin_note', 'account_approved', 'account_rejected', 'welcome'],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, default: '' },
  read: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
}, { timestamps: true });

AffiliateNotificationSchema.index({ affiliateId: 1, read: 1 });
AffiliateNotificationSchema.index({ affiliateId: 1, createdAt: -1 });

export default mongoose.models.AffiliateNotification || mongoose.model<IAffiliateNotification>('AffiliateNotification', AffiliateNotificationSchema);
