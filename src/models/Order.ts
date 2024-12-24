import mongoose, { Schema, Document } from "mongoose";

interface IAttachment {
  filename: string;
  path: string;
}

interface IOrder extends Document {
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    pages: number;
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
      }
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ["pending", "in-progress", "completed", "cancelled"], default: "pending" },
    paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded"], default: "unpaid" },
    paypalOrderId: { type: String, required: true },
    paypalTransactionId: { type: String, required: true },
    attachments: [attachmentSchema],
    serviceName: { type: String, required: true },
    description: { type: String, required: true },
    pages: { type: Number, required: true },
    totalWords: { type: Number, required: false },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;

