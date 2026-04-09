import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'admin' | 'customer' | 'provider';
  profile_image?: string;
  status: 'active' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: function() {
        // Password might not be required if implementing OAuth later
        return true; 
      },
    },
    role: {
      type: String,
      enum: ['admin', 'customer', 'provider'],
      default: 'customer',
      required: true,
    },
    profile_image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export const User = mongoose.model<IUser>('User', userSchema);
