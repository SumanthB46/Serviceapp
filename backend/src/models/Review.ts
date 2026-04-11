import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReview extends Document {
  booking_id: Types.ObjectId;
  user_id: Types.ObjectId;
  provider_id: Types.ObjectId;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    booking_id: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true, // One review per booking
    },
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model<IReview>('Review', reviewSchema);
