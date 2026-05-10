import mongoose, { Schema, Document } from 'mongoose';

export interface IProductPlan {
  id: string;
  nameEn: string;
  nameBn: string;
  priceTk: number;
  priceUsd?: number;
  duration: 'Monthly' | 'Yearly' | 'Lifetime';
}

export interface IBulletPoint {
  id: string;
  textEn: string;
  textBn: string;
  visible: boolean;
  order: number;
  icon?: string;
}

export interface IFeature {
  id: string;
  textEn: string;
  textBn: string;
  visible: boolean;
  highlighted: boolean;
  order: number;
  includedInPlanIds?: string[];
}

export interface IProduct extends Document {
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
  image: string;
  visible: boolean;
  order: number;
  plans: IProductPlan[];
  bulletPoints: IBulletPoint[];
  features: IFeature[];
  slug: string;
}

const PlanSchema = new Schema({
  id: { type: String, required: true },
  nameEn: { type: String, required: true },
  nameBn: { type: String, required: true },
  priceTk: { type: Number, required: true },
  priceUsd: { type: Number },
  duration: { type: String, enum: ['Monthly', 'Yearly', 'Lifetime'], required: true },
});

const BulletPointSchema = new Schema({
  id: { type: String, required: true },
  textEn: { type: String, required: true },
  textBn: { type: String, required: true },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  icon: { type: String },
});

const FeatureSchema = new Schema({
  id: { type: String, required: true },
  textEn: { type: String, required: true },
  textBn: { type: String, required: true },
  visible: { type: Boolean, default: true },
  highlighted: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  includedInPlanIds: { type: [String], default: [] },
});

const ProductSchema = new Schema<IProduct>({
  titleEn: { type: String, required: true },
  titleBn: { type: String, required: true },
  subtitleEn: { type: String },
  subtitleBn: { type: String },
  badgeEn: { type: String },
  badgeBn: { type: String },
  shortDescriptionEn: { type: String },
  shortDescriptionBn: { type: String },
  buttonTextEn: { type: String },
  buttonTextBn: { type: String },
  telegramLink: { type: String },
  image: { type: String },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  plans: { type: [PlanSchema], default: [] },
  bulletPoints: { type: [BulletPointSchema], default: [] },
  features: { type: [FeatureSchema], default: [] },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
