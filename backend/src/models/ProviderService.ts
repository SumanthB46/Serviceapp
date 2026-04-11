import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProviderService extends Document {
  provider_id: Types.ObjectId;
  service_id: Types.ObjectId;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

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
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a provider doesn't add the same service twice
providerServiceSchema.index({ provider_id: 1, service_id: 1 }, { unique: true });

export const ProviderService = mongoose.model<IProviderService>('ProviderService', providerServiceSchema);
