import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  name: string;
  roleEn: string;
  roleBn: string;
  image: string;
  rating: number;
  reviewEn: string;
  reviewBn: string;
  featured: boolean;
  visible: boolean;
  order: number;
}

const ReviewSchema = new Schema<IReview>({
  name: { type: String, required: true },
  roleEn: { type: String },
  roleBn: { type: String },
  image: { type: String },
  rating: { type: Number, default: 5 },
  reviewEn: { type: String, required: true },
  reviewBn: { type: String, required: true },
  featured: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
