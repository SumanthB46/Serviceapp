import mongoose, { Document, Schema, Types } from 'mongoose';

interface IDocument {
  doc_type: string;
  file_url: string;
  uploaded_at: Date;
}

export interface IProviderService extends Document {
  provider_id: Types.ObjectId;
  location_ids: Types.ObjectId[]; // Refers to Locations
  experience: number;
  price: number;
  discount: number;
  final_price: number;
  subservice_ids: Types.ObjectId[];
  documents: IDocument[];
  availability: {
    day: string;
    start_time: string;
    end_time: string;
    slot_duration: number;
    buffer_time: number;
  }[];
  is_featured: boolean;
  is_available: boolean;
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
    location_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Location',
      },
    ],
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
    subservice_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SubService',
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
    is_featured: {
      type: Boolean,
      default: false,
    },
    is_available: {
      type: Boolean,
      default: true,
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

providerServiceSchema.index({ location_ids: 1 });
providerServiceSchema.index({ isDeleted: 1 });

export const ProviderService = mongoose.model<IProviderService>('ProviderService', providerServiceSchema);
