import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBooking extends Document {
  booking_id: string;
  user_id: Types.ObjectId;
  provider_id?: Types.ObjectId;
  subservice_id: Types.ObjectId;
  provider_service_id?: Types.ObjectId;
  address_id: Types.ObjectId;
  variant_name?: string;
  
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  
  scheduled_at: Date;
  booking_time: string;
  
  service_price: number;
  discount_amount: number;
  payable_amount: number;
  
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: 'cod' | 'online' | 'wallet';
  
  completed_at?: Date;
  cancelled_at?: Date;
  cancellation_reason?: string;
  cancelled_by?: 'customer' | 'provider' | 'admin';
  
  start_otp?: string;
  completion_otp?: string;
  provider_response_time?: number; // In minutes
  provider_arrival_time?: Date;
  
  invoice_url?: string;
  cancel_refund_status?: 'pending' | 'processed';
  
  refund_status?: 'none' | 'pending' | 'processing' | 'refunded' | 'failed';
  refund_amount?: number;
  refund_reason?: string;
  
  applied_coupon?: string;

  is_reviewed: boolean;
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
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider_id: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: false,
    },
    subservice_id: {
      type: Schema.Types.ObjectId,
      ref: 'SubService',
      required: true,
    },
    provider_service_id: {
      type: Schema.Types.ObjectId,
      ref: 'ProviderService',
      required: false,
    },
    address_id: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
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
    booking_time: {
      type: String,
      required: true,
    },
    service_price: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_amount: {
      type: Number,
      default: 0,
    },
    payable_amount: {
      type: Number,
      required: true,
      default: 0,
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
    start_otp: {
      type: String,
    },
    completion_otp: {
      type: String,
    },
    provider_response_time: {
      type: Number,
    },
    provider_arrival_time: {
      type: Date,
    },
    invoice_url: {
      type: String,
    },
    cancel_refund_status: {
      type: String,
      enum: ['pending', 'processed'],
    },
    refund_status: {
      type: String,
      enum: ['none', 'pending', 'processing', 'refunded', 'failed'],
      default: 'none',
    },
    refund_amount: {
      type: Number,
      default: 0,
    },
    refund_reason: {
      type: String,
    },
    applied_coupon: {
      type: String,
    },
    is_reviewed: {
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

// Indexes for faster lookups
bookingSchema.index({ user_id: 1 });
bookingSchema.index({ provider_id: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ scheduled_at: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
