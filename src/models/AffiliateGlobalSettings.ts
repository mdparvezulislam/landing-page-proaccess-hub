import mongoose, { Schema, Document } from 'mongoose';

export interface IAffiliateGlobalSettings extends Document {
  defaultDiscountPercent: number;
  defaultCommissionPercent: number;
  referralSignupReward: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  referralCookieDays: number;
  defaultCurrency: 'BDT' | 'USDT';
  updatedAt: Date;
}

const AffiliateGlobalSettingsSchema = new Schema<IAffiliateGlobalSettings>({
  defaultDiscountPercent: { type: Number, default: 5 },
  defaultCommissionPercent: { type: Number, default: 20 },
  referralSignupReward: { type: Number, default: 10 },
  minWithdrawal: { type: Number, default: 5 },
  maxWithdrawal: { type: Number, default: 0 },
  referralCookieDays: { type: Number, default: 30 },
  defaultCurrency: { type: String, enum: ['BDT', 'USDT'], default: 'BDT' },
}, { timestamps: true });

export async function getAffiliateGlobalSettings(): Promise<IAffiliateGlobalSettings> {
  const Model = mongoose.models.AffiliateGlobalSettings || mongoose.model<IAffiliateGlobalSettings>('AffiliateGlobalSettings', AffiliateGlobalSettingsSchema);
  let settings = await Model.findOne().lean() as any;
  if (!settings) {
    settings = await Model.create({
      defaultDiscountPercent: 5,
      defaultCommissionPercent: 20,
      referralSignupReward: 10,
      minWithdrawal: 5,
      maxWithdrawal: 0,
      referralCookieDays: 30,
      defaultCurrency: 'BDT',
    });
  }
  return settings;
}

export default mongoose.models.AffiliateGlobalSettings || mongoose.model<IAffiliateGlobalSettings>('AffiliateGlobalSettings', AffiliateGlobalSettingsSchema);
