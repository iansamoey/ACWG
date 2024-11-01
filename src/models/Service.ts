import { Schema, model, Document } from 'mongoose';

interface IService extends Document {
  name: string;
  description: string;
  price: number;
  createdAt: Date;   // Make sure this is of type Date
  updatedAt: Date;   // Make sure this is of type Date
}

const serviceSchema = new Schema<IService>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },  // Use Date.now to automatically set the date
  updatedAt: { type: Date, default: Date.now },  // Use Date.now to automatically set the date
});

// Middleware to update the `updatedAt` field before saving
serviceSchema.pre('save', function (next) {
  this.updatedAt = new Date(); // Update the `updatedAt` field
  next();
});

const Service = model<IService>('Service', serviceSchema);

export default Service;
