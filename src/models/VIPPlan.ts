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

  // ─── Official Track (Premium) ───
  officialPriceBDT: number;
  officialPriceUSDT: number;
  officialStarterBDT: number;
  officialStarterUSDT: number;
  officialMonthlyBDT: number;
  officialMonthlyUSDT: number;

  // ─── Starter Track ───
  starterOfficialBDT: number;
  starterOfficialUSDT: number;
  starterPriceBDT: number;
  starterPriceUSDT: number;
  starterMonthlyBDT: number;
  starterMonthlyUSDT: number;
  starterEnableDiscount: boolean;
  starterDiscountPercent: number;
  starterDiscountPriceBDT: number;
  starterDiscountPriceUSDT: number;

  // ─── Optional Discount (applies to Official Track) ───
  enableDiscount: boolean;
  discountPercent: number;
  discountPriceBDT: number;
  discountPriceUSDT: number;

  dueEveryDays: number;
  reminderBeforeDays: number;
  autoReminderEnabled: boolean;
  enableInstallments: boolean;

  enableMembershipTracking: boolean;
  enableBanSystem: boolean;
  enableReminderSystem: boolean;
  enableNotifications: boolean;

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

  // Official Track
  officialPriceBDT: { type: Number, default: 15000 },
  officialPriceUSDT: { type: Number, default: 120 },
  officialStarterBDT: { type: Number, default: 5000 },
  officialStarterUSDT: { type: Number, default: 40 },
  officialMonthlyBDT: { type: Number, default: 500 },
  officialMonthlyUSDT: { type: Number, default: 4 },

  // Starter Track
  starterOfficialBDT: { type: Number, default: 15000 },
  starterOfficialUSDT: { type: Number, default: 120 },
  starterPriceBDT: { type: Number, default: 3000 },
  starterPriceUSDT: { type: Number, default: 24 },
  starterMonthlyBDT: { type: Number, default: 399 },
  starterMonthlyUSDT: { type: Number, default: 3 },
  starterEnableDiscount: { type: Boolean, default: false },
  starterDiscountPercent: { type: Number, default: 30 },
  starterDiscountPriceBDT: { type: Number, default: 11199 },
  starterDiscountPriceUSDT: { type: Number, default: 90 },

  // Discount
  discountPercent: { type: Number, default: 30 },
  enableDiscount: { type: Boolean, default: false },
  discountPriceBDT: { type: Number, default: 11199 },
  discountPriceUSDT: { type: Number, default: 90 },

  dueEveryDays: { type: Number, default: 30 },
  reminderBeforeDays: { type: Number, default: 3 },
  autoReminderEnabled: { type: Boolean, default: false },
  enableInstallments: { type: Boolean, default: true },

  enableMembershipTracking: { type: Boolean, default: true },
  enableBanSystem: { type: Boolean, default: true },
  enableReminderSystem: { type: Boolean, default: true },
  enableNotifications: { type: Boolean, default: true },

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
