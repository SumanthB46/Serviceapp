import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProvider extends Document {
  user_id: Types.ObjectId;
  availability_status: 'available' | 'busy' | 'offline';
  kyc_status: 'pending' | 'verified' | 'rejected';
  location_id?: Types.ObjectId;

  rejection_reason?: string;

  profile_image?: string;
  bio?: string;
  languages: string[];
  
  years_of_experience: number;
  total_jobs: number;
  completed_jobs: number;
  cancelled_jobs: number;
  acceptance_rate: number;
  completion_rate: number;

  overall_rating: number;
  rating_breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };

  last_active_at?: Date;
  current_location?: {
    type: 'Point';
    coordinates: number[]; // [lng, lat]
  };

  portfolio: {
    image: string;
    description: string;
  }[];

  cancellation_count: number;
  penalty_amount: number;

  is_verified: boolean;
  aadhar_id?: string;


  bank_details?: {
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    bank_name: string;
    branch: string;
  };
  verification_docs?: {
    id_proof_url: string;
    selfie_url: string;
  };
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
    kyc_status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    rejection_reason: {
      type: String,
      trim: true,
    },
    location_id: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
    },

    profile_image: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    languages: {
      type: [String],
      default: [],
    },
    total_jobs: {
      type: Number,
      default: 0,
    },
    completed_jobs: {
      type: Number,
      default: 0,
    },
    cancelled_jobs: {
      type: Number,
      default: 0,
    },
    acceptance_rate: {
      type: Number,
      default: 0,
    },
    completion_rate: {
      type: Number,
      default: 0,
    },
    years_of_experience: {
      type: Number,
      default: 0,
    },
    overall_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    rating_breakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 },
    },
    last_active_at: {
      type: Date,
    },
    current_location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [0, 0],
      },
    },
    portfolio: [
      {
        image: { type: String, required: true },
        description: { type: String },
      },
    ],
    cancellation_count: {
      type: Number,
      default: 0,
    },
    penalty_amount: {
      type: Number,
      default: 0,
    },


    aadhar_id: {
      type: String,
      trim: true,
    },
    bank_details: {
      account_holder_name: { type: String, trim: true },
      account_number: { type: String, trim: true },
      ifsc_code: { type: String, trim: true },
      bank_name: { type: String, trim: true },
      branch: { type: String, trim: true },
    },
    verification_docs: {
      id_proof_url: { type: String, trim: true },
      selfie_url: { type: String, trim: true },
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
