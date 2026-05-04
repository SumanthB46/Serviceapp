import mongoose, { Document, Schema, Types } from 'mongoose';

interface IDocument {
  doc_type: string;
  file_url: string;
  uploaded_at: Date;
}

export interface IProviderService extends Document {
  provider_id: Types.ObjectId;
  service_id: Types.ObjectId;    // Refers to the SubService/Service catalog
  location_ids: Types.ObjectId[]; // Refers to Locations
  service_name: string;          // Denormalized for easier search
  experience: number;
  price: number;
  discount: number;
  final_price: number;
  currency: string;
  skills: string[];
  documents: IDocument[];
  availability: {
    day: string;
    start_time: string;
    end_time: string;
    slot_duration: number;
    buffer_time: number;
  }[];
  min_price: number;
  max_price: number;
  is_featured: boolean;
  is_available: boolean;

  weekly_off: string[]; // ['Sunday']
  blocked_dates: {
    date: Date;
    reason: string;
  }[];

  service_radius_km: number;
  service_rating: number;
  total_reviews: number;
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
    location_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Location',
      },
    ],
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
    discount: {
      type: Number,
      default: 0,
    },
    final_price: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    min_price: {
      type: Number,
      default: 0,
    },
    max_price: {
      type: Number,
      default: 0,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    is_available: {
      type: Boolean,
      default: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    weekly_off: {
      type: [String],
      default: [],
    },
    blocked_dates: [
      {
        date: { type: Date, required: true },
        reason: { type: String },
      },
    ],


    documents: {
      type: [documentSchema],
      default: [],
    },
    availability: [
      {
        day: { type: String, required: true },
        start_time: { type: String, required: true },
        end_time: { type: String, required: true },
        slot_duration: { type: Number, default: 60 },
        buffer_time: { type: Number, default: 0 },
      },
    ],
    service_radius_km: {
      type: Number,
      default: 10,
    },
    service_rating: {

      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    total_reviews: {
      type: Number,
      default: 0,
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

// Added requested indexes
providerServiceSchema.index({ service_id: 1 });
providerServiceSchema.index({ location_ids: 1 });
providerServiceSchema.index({ isDeleted: 1 });

export const ProviderService = mongoose.model<IProviderService>('ProviderService', providerServiceSchema);

