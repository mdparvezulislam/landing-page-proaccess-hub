import mongoose, { Schema } from 'mongoose';

const HeroSchema = new Schema({
  badgeEn: String,
  badgeBn: String,
  titleEn: String,
  titleBn: String,
  titleAccentEn: String,
  titleAccentBn: String,
  subtitleEn: String,
  subtitleBn: String,
  descriptionEn: String,
  descriptionBn: String,
  cta1En: String,
  cta1Bn: String,
  cta2En: String,
  cta2Bn: String,
  stats: [{
    labelEn: String,
    labelBn: String,
    valueEn: String,
    valueBn: String,
  }]
});

const SiteSchema = new Schema({
  siteNameEn: String,
  siteNameBn: String,
  telegramLink: String,
  telegramHandle: String,
  floatingCTAEn: String,
  floatingCTABn: String,
  announcementEn: String,
  announcementBn: String,
  showAnnouncement: Boolean,
});

const NavbarSchema = new Schema({
  items: [{
    id: String,
    labelEn: String,
    labelBn: String,
    url: String,
    order: Number,
  }]
});

const FooterSchema = new Schema({
  copyrightEn: String,
  copyrightBn: String,
  links: [{
    labelEn: String,
    labelBn: String,
    url: String,
  }]
});

const CountdownSchema = new Schema({
  enabled: Boolean,
  targetDate: String,
  titleEn: String,
  titleBn: String,
  subtitleEn: String,
  subtitleBn: String,
});

const TrustBadgeSchema = new Schema({
  id: String,
  textEn: String,
  textBn: String,
  icon: String,
  visible: Boolean,
  order: Number,
});

const GlobalFeatureSchema = new Schema({
  id: String,
  titleEn: String,
  titleBn: String,
  descriptionEn: String,
  descriptionBn: String,
  icon: String,
  visible: Boolean,
  order: Number,
});

const PaymentMethodSchema = new Schema({
  id: String,
  name: String,
  number: String,
  accountTypeEn: String,
  accountTypeBn: String,
  accountHolder: String,
  qrCode: String,
  instructionsEn: String,
  instructionsBn: String,
  warningTextEn: String,
  warningTextBn: String,
  color: String,
  enabled: Boolean,
  order: Number,
});

const PaymentSettingsSchema = new Schema({
  instructionTitleEn: String,
  instructionTitleBn: String,
  instructionsEn: [String],
  instructionsBn: [String],
  warningTextEn: String,
  warningTextBn: String,
  methods: [PaymentMethodSchema],
});

const SettingsSchema = new Schema({
  hero: { type: HeroSchema },
  site: { type: SiteSchema },
  navbar: { type: NavbarSchema },
  footer: { type: FooterSchema },
  countdown: { type: CountdownSchema },
  trustBadges: [TrustBadgeSchema],
  globalFeatures: [GlobalFeatureSchema],
  paymentSettings: { type: PaymentSettingsSchema },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
