import mongoose, { Document, Schema, Types } from 'mongoose';

interface IDocument {
  doc_type: string;
  file_url: string;
  uploaded_at: Date;
}

export interface IProviderService extends Document {
  provider_id: Types.ObjectId;
  service_id: Types.ObjectId;    // Refers to the SubService/Service catalog
  location_id?: Types.ObjectId;  // Refers to Location
  service_name: string;          // Denormalized for easier search
  experience: number;
  price: number;
  skills: string[];
  documents: IDocument[];
  service_rating: number;
  is_active: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    doc_type: { type: String, required: true },
    file_url: { type: String, required: true },
    uploaded_at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const providerServiceSchema = new Schema<IProviderService>(
  {
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
    location_id: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
    },
    service_name: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    documents: {
      type: [documentSchema],
      default: [],
    },
    service_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    is_active: {
      type: Boolean,
      default: true,
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

// Compound index to ensure a provider doesn't register the same service multiple times
providerServiceSchema.index({ provider_id: 1, service_id: 1 }, { unique: true });

export const ProviderService = mongoose.model<IProviderService>('ProviderService', providerServiceSchema);
