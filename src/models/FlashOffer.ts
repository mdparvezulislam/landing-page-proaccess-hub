import mongoose, { Schema, Document } from 'mongoose';

export interface IFlashOffer extends Document {
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  buttonTextEn: string;
  buttonTextBn: string;
  redirectLink: string;
  visible: boolean;
  featured: boolean;
  startDate: Date;
  endDate: Date;
  expired: boolean;
  badgeTextEn: string;
  badgeTextBn: string;
  backgroundStyle: string;
  glowStyle: string;
  showOnHomepage: boolean;
  showOnVIPSection: boolean;
  showOnPricingSection: boolean;
  showOnHeroSection: boolean;
  selectedSection: string;
  productId: string;
  vipPlanId: string;
  countdownEnabled: boolean;
  order: number;
  totalSlots: number;
  remainingSlots: number;
  slotSystemEnabled: boolean;
  stickyEnabled: boolean;
}

const FlashOfferSchema = new Schema<IFlashOffer>({
  titleEn: { type: String, default: '' },
  titleBn: { type: String, default: '' },
  subtitleEn: { type: String, default: '' },
  subtitleBn: { type: String, default: '' },
  descriptionEn: { type: String, default: '' },
  descriptionBn: { type: String, default: '' },
  buttonTextEn: { type: String, default: 'Claim Offer' },
  buttonTextBn: { type: String, default: 'অফার নিন' },
  redirectLink: { type: String, default: '' },
  visible: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  expired: { type: Boolean, default: false },
  badgeTextEn: { type: String, default: 'Limited Time Offer' },
  badgeTextBn: { type: String, default: 'সীমিত সময়ের অফার' },
  backgroundStyle: { type: String, default: 'premium' },
  glowStyle: { type: String, default: 'amber' },
  showOnHomepage: { type: Boolean, default: true },
  showOnVIPSection: { type: Boolean, default: false },
  showOnPricingSection: { type: Boolean, default: false },
  showOnHeroSection: { type: Boolean, default: false },
  selectedSection: { type: String, default: '#homepage' },
  productId: { type: String, default: '' },
  vipPlanId: { type: String, default: '' },
  countdownEnabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  totalSlots: { type: Number, default: 0 },
  remainingSlots: { type: Number, default: 0 },
  slotSystemEnabled: { type: Boolean, default: false },
  stickyEnabled: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.FlashOffer || mongoose.model<IFlashOffer>('FlashOffer', FlashOfferSchema);
