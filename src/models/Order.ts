import mongoose, { Schema, Document } from "mongoose";

interface IAttachment {
  filename: string;
  path: string;
}

interface IOrder extends Document {
  userId: string;
  serviceName: string;
  description: string;
  price: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
  attachments: IAttachment[];
}

const attachmentSchema = new Schema<IAttachment>({
  filename: { type: String, required: true },
  path: { type: String, required: true },
});

const orderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  serviceName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  attachments: [attachmentSchema],
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;

