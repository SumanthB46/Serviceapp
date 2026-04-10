import mongoose, { Document, Schema } from 'mongoose';

export interface IOffer extends Document {
  code: string;
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
