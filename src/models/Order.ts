// File: src/models/Order.ts
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    service: { type: String, required: true },
    date: { type: Date, required: true },
    details: { type: String, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export default Order;
