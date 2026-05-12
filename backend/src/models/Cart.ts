import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICart extends Document {
  user_id: Types.ObjectId;

  items: {
    subservice_id: Types.ObjectId;
    quantity: number;
    price_snapshot: number;
    added_at: Date;
  }[];

  scheduled_at?: Date;
  address_id?: Types.ObjectId;
  total_amount: number;

  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        subservice_id: {
          type: Schema.Types.ObjectId,
          ref: 'SubService',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price_snapshot: {
          type: Number,
          required: true,
        },
        added_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    scheduled_at: {
      type: Date,
    },
    address_id: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
    },
    total_amount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate total_amount before saving
cartSchema.pre('save', function (this: ICart) {
  this.total_amount = this.items.reduce((total, item) => {
    return total + item.price_snapshot * item.quantity;
  }, 0);
});


export const Cart = mongoose.model<ICart>('Cart', cartSchema);
