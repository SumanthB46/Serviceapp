import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProvider extends Document {
  user_id: Types.ObjectId;
  availability_status: 'available' | 'busy' | 'offline';
  kyc_status: 'pending' | 'verified' | 'rejected';
  is_verified: boolean;
  
  // Security-focused Aadhar storage
  aadhar_last4?: string;
  aadhar_hash?: string;
  
  bank_details?: {
    account_holder_name: string;
    account_number_last4: string;
    account_number_hash: string;
    ifsc_code: string;
    bank_name: string;
    branch: string;
  };
  
  verification_docs?: {
    id_proof_url: string;
    public_id?: string;
    resource_type?: string;
  };
  kyc_rejection_reason?: string;
  verified_at?: Date;
  verification_docs_expiry?: Date;
  
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
    is_verified: {
      type: Boolean,
      default: false,
    },
    aadhar_last4: {
      type: String,
      trim: true,
    },
    aadhar_hash: {
      type: String,
    },
    bank_details: {
      account_holder_name: { type: String, trim: true },
      account_number_last4: { type: String, trim: true },
      account_number_hash: { type: String },
      ifsc_code: { type: String, trim: true },
      bank_name: { type: String, trim: true },
      branch: { type: String, trim: true },
    },
    verification_docs: {
      id_proof_url: { type: String, trim: true },
      public_id: { type: String, trim: true },
      resource_type: { type: String, trim: true },
    },
    kyc_rejection_reason: { type: String },
    verified_at: { type: Date },
    verification_docs_expiry: { type: Date },
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
