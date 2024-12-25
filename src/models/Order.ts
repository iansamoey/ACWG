import mongoose, { Schema, Document, model, Model, Types } from "mongoose";

export interface IAttachment {
  filename: string;
  path: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    pages: number;
    totalWords: number;
  }>;
  total: number;
  status: string;
  paymentStatus: string;
  paypalOrderId: string;
  paypalTransactionId: string;
  createdAt: Date;
  updatedAt: Date;
  attachments: IAttachment[];
  serviceName: string;
  description: string;
  pages: number;
  totalWords: number;
}

const attachmentSchema = new Schema<IAttachment>({
  filename: { type: String, required: true },
  path: { type: String, required: true },
});

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    items: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        pages: { type: Number, required: true },
        totalWords: { type: Number, required: true },
      }
    ],
    total: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["pending", "in-progress", "completed", "cancelled"], 
      default: "pending" 
    },
    paymentStatus: { 
      type: String, 
      enum: ["unpaid", "paid", "refunded"], 
      default: "unpaid" 
    },
    paypalOrderId: { type: String, required: true },
    paypalTransactionId: { type: String, required: true },
    attachments: [attachmentSchema],
    serviceName: { type: String, required: true },
    description: { type: String, required: true },
    pages: { 
      type: Number, 
      required: true,
      min: 1 
    },
    totalWords: { 
      type: Number, 
      required: true,
      default: function(this: IOrder): number {
        return this.pages * 250;
      },
      min: 0
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add a pre-save middleware to ensure totalWords is set
orderSchema.pre('save', function(next) {
  if (!this.totalWords && this.pages) {
    this.totalWords = this.pages * 250;
  }
  next();
});

const Order: Model<IOrder> = mongoose.models.Order || model<IOrder>("Order", orderSchema);

export default Order;

