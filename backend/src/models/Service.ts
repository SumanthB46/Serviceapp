import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IService extends Document {
  category_id: Types.ObjectId;
  service_name: string;
  description: string;
  base_price: number;
  duration: number;       // duration in minutes
  image: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    service_name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    base_price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,   // stored in minutes (e.g. 60 = 1 hour)
      required: true,
      min: 1,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      required: true,
    },
  },
  {
    timestamps: true, // auto-adds createdAt and updatedAt
  }
);

export const Service = mongoose.model<IService>('Service', serviceSchema);
