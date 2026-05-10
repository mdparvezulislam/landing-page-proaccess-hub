import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
  qEn: string;
  qBn: string;
  aEn: string;
  aBn: string;
  visible: boolean;
  order: number;
}

const FAQSchema = new Schema<IFAQ>({
  qEn: { type: String, required: true },
  qBn: { type: String, required: true },
  aEn: { type: String, required: true },
  aBn: { type: String, required: true },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema);
