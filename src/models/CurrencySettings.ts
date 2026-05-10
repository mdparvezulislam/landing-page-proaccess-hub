import mongoose, { Schema, Document } from 'mongoose';

export interface ICurrencySettings extends Document {
  usdtRate: number;
  defaultCurrency: 'BDT' | 'USDT';
  enableCurrencyToggle: boolean;
}

const CurrencySettingsSchema = new Schema<ICurrencySettings>({
  usdtRate: { type: Number, default: 125 },
  defaultCurrency: { type: String, enum: ['BDT', 'USDT'], default: 'BDT' },
  enableCurrencyToggle: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.CurrencySettings || mongoose.model<ICurrencySettings>('CurrencySettings', CurrencySettingsSchema);
