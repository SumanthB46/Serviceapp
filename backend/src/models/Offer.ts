import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOffer extends Document {
  code: string;
  coupon_id?: string; // External coupon reference
  provider_service_id?: Types.ObjectId; // Optional link to a specific provider service
  discount_type: 'flat' | 'percentage';
  discount_value: number;
  min_amount: number;
  expiry_date: Date;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const offerSchema = new Schema<IOffer>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    coupon_id: {
      type: String,
      trim: true,
    },
    provider_service_id: {
      type: Schema.Types.ObjectId,
      ref: 'ProviderService',
    },
    discount_type: {
      type: String,
      enum: ['flat', 'percentage'],
      required: true,
    },
    discount_value: {
      type: Number,
      required: true,
      min: 0,
    },
    min_amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const Offer = mongoose.model<IOffer>('Offer', offerSchema);
