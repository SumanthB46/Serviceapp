import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBooking extends Document {
  booking_id: string;
  customer_id: Types.ObjectId;
  provider_id: Types.ObjectId;
  service_id: Types.ObjectId; // Original Service/SubService
  provider_service_id: Types.ObjectId; // The provider's specific offering
  
  variant_name?: string; // If applicable from variants
  
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  
  scheduled_at: Date;
  completed_at?: Date;
  cancelled_at?: Date;
  cancellation_reason?: string;
  cancelled_by?: 'customer' | 'provider' | 'admin';
  
  total_amount: number;
  payable_amount: number;
  discount_amount: number;
  currency: string;
  
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: 'cod' | 'online' | 'wallet';
  
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: {
      type: 'Point';
      coordinates: number[];
    };
  };
  
  provider_response_time?: number; // In minutes
  otp?: string; // For job start/end verification
  
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    booking_id: {
      type: String,
      unique: true,
      required: true,
    },
    customer_id: {
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
    provider_service_id: {
      type: Schema.Types.ObjectId,
      ref: 'ProviderService',
      required: true,
    },
    variant_name: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    scheduled_at: {
      type: Date,
      required: true,
    },
    completed_at: {
      type: Date,
    },
    cancelled_at: {
      type: Date,
    },
    cancellation_reason: {
      type: String,
    },
    cancelled_by: {
      type: String,
      enum: ['customer', 'provider', 'admin'],
    },
    total_amount: {
      type: Number,
      required: true,
      default: 0,
    },
    payable_amount: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    payment_status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    payment_method: {
      type: String,
      enum: ['cod', 'online', 'wallet'],
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [lng, lat]
          required: true,
        },
      },
    },
    provider_response_time: {
      type: Number,
    },
    otp: {
      type: String,
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

// Indexes for faster lookups
bookingSchema.index({ customer_id: 1 });
bookingSchema.index({ provider_id: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ scheduled_at: 1 });
bookingSchema.index({ location: '2dsphere' });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
