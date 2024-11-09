import mongoose, { Schema, Document } from "mongoose";

interface IOrder extends Document {
  userId: string;
  serviceName: string;
  description: string;
  price: number;
  total: number;
  status: string;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  serviceName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: "pending" },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
