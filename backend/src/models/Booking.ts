import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBooking extends Document {
  user_id: Types.ObjectId;
  provider_id: Types.ObjectId;
  service_id: Types.ObjectId;
  booking_date: Date;
  time_slot: string;
  address: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider_id: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
    },
    service_id: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    booking_date: {
      type: Date,
      required: true,
    },
    time_slot: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
