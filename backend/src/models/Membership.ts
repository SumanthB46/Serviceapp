import mongoose, { Document, Schema } from 'mongoose';

export interface IMembership extends Document {
  name: string;
  description: string;
  price: number;
  duration: 'monthly' | 'quarterly' | 'yearly';
  discountPercentage: number;
  features: string[];
  benefits: string[];
  badgeLabel?: string;
  cardHighlightColor?: string;
  isPopular: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const membershipSchema = new Schema<IMembership>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { 
      type: String, 
      enum: ['monthly', 'quarterly', 'yearly'], 
      required: true 
    },
    discountPercentage: { type: Number, default: 0 },
    features: [{ type: String }],
    benefits: [{ type: String }],
    badgeLabel: { type: String },
    cardHighlightColor: { type: String, default: '#2563EB' },
    isPopular: { type: Boolean, default: false },
    status: { 
      type: String, 
      enum: ['active', 'inactive'], 
      default: 'active' 
    }
  },
  { timestamps: true }
);

export const Membership = mongoose.model<IMembership>('Membership', membershipSchema);
