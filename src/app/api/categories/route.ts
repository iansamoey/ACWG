import { NextResponse } from "next/server"
import Category from "../../../models/Category"
import dbConnect from "../../../lib/db"

// Create Category
export const POST = async (request: Request) => {
  try {
    await dbConnect()
    const { name, description } = await request.json()
    const category = new Category({ name, description })
    await category.save()
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

// Read Categories
export const GET = async () => {
  try {
    await dbConnect()
    const categories = await Category.find()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

// Update Category
export const PATCH = async (request: Request) => {
  try {
    await dbConnect()
    const { id, name, description } = await request.json()
    const updatedCategory = await Category.findByIdAndUpdate(id, { name, description }, { new: true })
    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

// Delete Category
export const DELETE = async (request: Request) => {
  try {
    await dbConnect()
    const { id } = await request.json()
    await Category.findByIdAndDelete(id)
    return NextResponse.json({ message: "Category deleted" }, { status: 204 })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}

