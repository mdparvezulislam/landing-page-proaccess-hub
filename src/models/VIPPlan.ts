import mongoose, { Schema, Document } from 'mongoose';

export interface IVIPBulletPoint {
  id: string;
  textEn: string;
  textBn: string;
  visible: boolean;
  order: number;
  highlighted: boolean;
}

export interface IVIPKeyHighlight {
  id: string;
  textEn: string;
  textBn: string;
  visible: boolean;
  order: number;
}

export interface IVIPFeature {
  id: string;
  textEn: string;
  textBn: string;
  visible: boolean;
  highlighted: boolean;
  order: number;
}

export interface IVIPNotice {
  id: string;
  textEn: string;
  textBn: string;
  visible: boolean;
  type: 'offer' | 'info' | 'warning';
}

export interface IVIPFAQ {
  id: string;
  qEn: string;
  qBn: string;
  aEn: string;
  aBn: string;
  visible: boolean;
  order: number;
}

export interface IVIPPlan extends Document {
  // Content
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  badgeEn: string;
  badgeBn: string;
  shortDescriptionEn: string;
  shortDescriptionBn: string;
  buttonTextEn: string;
  buttonTextBn: string;
  telegramLink: string;
  tgPostLink: string;
  image: string;
  featured: boolean;
  visible: boolean;
  order: number;

  // Pricing (all inline — no separate pricing model)
  regularPriceBDT: number;
  regularPriceUSDT: number;
  officialPriceBDT: number;
  officialPriceUSDT: number;
  discountPriceBDT: number;
  discountPriceUSDT: number;
  starterPaymentBDT: number;
  starterPaymentUSDT: number;
  starterMonthlyBDT: number;
  starterMonthlyUSDT: number;
  premiumStartBDT: number;
  premiumStartUSDT: number;
  premiumMonthlyBDT: number;
  premiumMonthlyUSDT: number;
  totalPaymentBDT: number;
  totalPaymentUSDT: number;
  discountPercent: number;

  // Installment settings
  dueEveryDays: number;
  reminderBeforeDays: number;
  autoReminderEnabled: boolean;
  enableInstallments: boolean;

  // Limited offer
  limitedOfferEnabled: boolean;
  limitedOfferPriceBDT: number;
  limitedOfferPriceUSDT: number;
  limitedOfferSlots: number;
  limitedOfferExpireDate: Date | null;

  // Membership settings
  enableMembershipTracking: boolean;
  enableBanSystem: boolean;
  enableReminderSystem: boolean;
  enableNotifications: boolean;

  // Content arrays
  bulletPoints: IVIPBulletPoint[];
  keyHighlights: IVIPKeyHighlight[];
  featureList: IVIPFeature[];
  notices: IVIPNotice[];
  faqs: IVIPFAQ[];
}

const VIPPlanSchema = new Schema<IVIPPlan>({
  titleEn: { type: String, required: true },
  titleBn: { type: String, required: true },
  subtitleEn: { type: String, default: '' },
  subtitleBn: { type: String, default: '' },
  badgeEn: { type: String, default: 'VIP' },
  badgeBn: { type: String, default: 'ভিআইপি' },
  shortDescriptionEn: { type: String, default: '' },
  shortDescriptionBn: { type: String, default: '' },
  buttonTextEn: { type: String, default: 'Get VIP Access Now' },
  buttonTextBn: { type: String, default: 'এখনই ভিআইপি অ্যাক্সেস নিন' },
  telegramLink: { type: String, default: '' },
  tgPostLink: { type: String, default: '' },
  image: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },

  // Pricing
  regularPriceBDT: { type: Number, default: 20000 },
  regularPriceUSDT: { type: Number, default: 160 },
  officialPriceBDT: { type: Number, default: 15000 },
  officialPriceUSDT: { type: Number, default: 120 },
  discountPriceBDT: { type: Number, default: 11199 },
  discountPriceUSDT: { type: Number, default: 90 },
  starterPaymentBDT: { type: Number, default: 5000 },
  starterPaymentUSDT: { type: Number, default: 40 },
  starterMonthlyBDT: { type: Number, default: 500 },
  starterMonthlyUSDT: { type: Number, default: 4 },
  premiumStartBDT: { type: Number, default: 3000 },
  premiumStartUSDT: { type: Number, default: 24 },
  premiumMonthlyBDT: { type: Number, default: 399 },
  premiumMonthlyUSDT: { type: Number, default: 3 },
  totalPaymentBDT: { type: Number, default: 12576 },
  totalPaymentUSDT: { type: Number, default: 100 },
  discountPercent: { type: Number, default: 30 },

  // Installment
  dueEveryDays: { type: Number, default: 30 },
  reminderBeforeDays: { type: Number, default: 3 },
  autoReminderEnabled: { type: Boolean, default: false },
  enableInstallments: { type: Boolean, default: true },

  // Limited offer
  limitedOfferEnabled: { type: Boolean, default: false },
  limitedOfferPriceBDT: { type: Number, default: 9999 },
  limitedOfferPriceUSDT: { type: Number, default: 80 },
  limitedOfferSlots: { type: Number, default: 0 },
  limitedOfferExpireDate: { type: Date, default: null },

  // Membership settings
  enableMembershipTracking: { type: Boolean, default: true },
  enableBanSystem: { type: Boolean, default: true },
  enableReminderSystem: { type: Boolean, default: true },
  enableNotifications: { type: Boolean, default: true },

  // Content arrays
  bulletPoints: [{
    id: { type: String, required: true },
    textEn: { type: String, default: '' },
    textBn: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    highlighted: { type: Boolean, default: false },
  }],
  keyHighlights: [{
    id: { type: String, required: true },
    textEn: { type: String, default: '' },
    textBn: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  }],
  featureList: [{
    id: { type: String, required: true },
    textEn: { type: String, default: '' },
    textBn: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    highlighted: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  }],
  notices: [{
    id: { type: String, required: true },
    textEn: { type: String, default: '' },
    textBn: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    type: { type: String, enum: ['offer', 'info', 'warning'], default: 'info' },
  }],
  faqs: [{
    id: { type: String, required: true },
    qEn: { type: String, default: '' },
    qBn: { type: String, default: '' },
    aEn: { type: String, default: '' },
    aBn: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  }],
}, { timestamps: true });

export default mongoose.models.VIPPlan || mongoose.model<IVIPPlan>('VIPPlan', VIPPlanSchema);
