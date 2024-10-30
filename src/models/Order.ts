export interface IOrder {
    _id: string; // Ensure this is defined as a string
    title: string;
    status: string;
    userId: string;
  }
  
  // Example model (if you are using Mongoose, for instance)
  import mongoose from 'mongoose';
  
  const orderSchema = new mongoose.Schema({
    title: { type: String, required: true },
    status: { type: String, required: true },
    userId: { type: String, required: true },
  });
  
  const OrderModel = mongoose.model('Order', orderSchema);
  export default OrderModel;
  