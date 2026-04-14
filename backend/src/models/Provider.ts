import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProvider extends Document {
  user_id: Types.ObjectId;
  availability_status: 'available' | 'busy' | 'offline';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Blocked';
  location: string;
  overall_rating: number;
  is_verified: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const providerSchema = new Schema<IProvider>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    availability_status: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'offline',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Blocked'],
      default: 'Pending',
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    overall_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Provider = mongoose.model<IProvider>('Provider', providerSchema);
