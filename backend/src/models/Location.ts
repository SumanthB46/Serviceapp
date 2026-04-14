import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  type: 'city' | 'area';
  parent_id?: Types.ObjectId | null;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  status: 'active' | 'inactive';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<ILocation>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['city', 'area'],
      required: true,
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      default: null,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
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

export const Location = mongoose.model<ILocation>('Location', locationSchema);
