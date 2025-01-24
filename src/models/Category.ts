import { Schema, model, type Document } from "mongoose"

interface ICategory extends Document {
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Middleware to update the `updatedAt` field before saving
categorySchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

const Category = model<ICategory>("Category", categorySchema)

export default Category

