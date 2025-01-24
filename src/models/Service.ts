import { Schema, model, type Document, type Types } from "mongoose"

interface IService extends Document {
  name: string
  description: string
  price: number
  category: Types.ObjectId // Reference to the Category model
  createdAt: Date
  updatedAt: Date
}

const serviceSchema = new Schema<IService>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true }, // Add this line
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Middleware to update the `updatedAt` field before saving
serviceSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

const Service = model<IService>("Service", serviceSchema)

export default Service

