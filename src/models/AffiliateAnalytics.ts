import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyStat {
  date: string;
  clicks: number;
  conversions: number;
  sales: number;
  commission: number;
}

export interface IMonthlyStat {
  month: string;
  clicks: number;
  conversions: number;
  sales: number;
  commission: number;
}

export interface ITopProduct {
  productId: string;
  productName: string;
  sales: number;
  commission: number;
}

export interface IAffiliateAnalytics extends Document {
  affiliateId: mongoose.Types.ObjectId;
  dailyStats: IDailyStat[];
  monthlyStats: IMonthlyStat[];
  topProducts: ITopProduct[];
}

const DailyStatSchema = new Schema<IDailyStat>({
  date: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
}, { _id: false });

const MonthlyStatSchema = new Schema<IMonthlyStat>({
  month: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
}, { _id: false });

const TopProductSchema = new Schema<ITopProduct>({
  productId: { type: String, default: '' },
  productName: { type: String, default: '' },
  sales: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
}, { _id: false });

const AffiliateAnalyticsSchema = new Schema<IAffiliateAnalytics>({
  affiliateId: { type: Schema.Types.ObjectId, ref: 'AffiliateUser', required: true, unique: true, index: true },
  dailyStats: [DailyStatSchema],
  monthlyStats: [MonthlyStatSchema],
  topProducts: [TopProductSchema],
}, { timestamps: true });

export default mongoose.models.AffiliateAnalytics || mongoose.model<IAffiliateAnalytics>('AffiliateAnalytics', AffiliateAnalyticsSchema);
