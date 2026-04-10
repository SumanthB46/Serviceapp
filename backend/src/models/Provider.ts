import mongoose, { Document, Schema, Types } from 'mongoose';

// Sub-schema for uploaded documents (ID proof, certificates, etc.)
interface IDocument {
  doc_type: string;   // e.g. "ID Proof", "Certificate"
  file_url: string;   // URL or base64
  uploaded_at: Date;
}

export interface IProvider extends Document {
  user_id: Types.ObjectId;
  experience: number;           // years of experience
  skills: string[];             // array of skill tags
  documents: IDocument[];       // ID proofs, certificates
  rating: number;               // average rating 0–5
  availability_status: 'available' | 'busy' | 'offline';
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    doc_type: {
      type: String,
      required: true,
      trim: true,
    },
    file_url: {
      type: String,
      required: true,
      trim: true,
    },
    uploaded_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // no separate _id for sub-documents
);

const providerSchema = new Schema<IProvider>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one provider profile per user
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
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
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    availability_status: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'offline',
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // auto-adds createdAt and updatedAt
  }
);

export const Provider = mongoose.model<IProvider>('Provider', providerSchema);
