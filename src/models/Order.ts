// src/models/Order.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  items: { id: string; name: string; price: number; quantity: number }[];
  total: number;
  status: string;
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ 
    id: String,
    name: String,
    price: Number,
    quantity: Number 
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'orders' }); // Specifies 'orders' collection

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
