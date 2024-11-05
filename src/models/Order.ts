// src/models/Order.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IOrder extends Document {
    userId: string;
    items: Array<{ id: string; name: string; price: number; quantity: number }>;
    total: number;
    status: string;
    createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
    userId: { type: String, required: true },
    items: [
        {
            id: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

// Use mongoose.models to avoid overwriting the model
const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
