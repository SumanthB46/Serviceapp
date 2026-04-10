import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAddress extends Document {
  user_id: Types.ObjectId;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  is_default: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address_line: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    is_default: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// If needed, can add pre-save hook to ensure only one is_default per user
// but that can be handled in the controller.

export const Address = mongoose.model<IAddress>('Address', addressSchema);
