import { NextResponse } from "next/server"
import Service from "../../../models/Service"
import dbConnect from "../../../lib/db"

// Create Service
export const POST = async (request: Request) => {
  try {
    await dbConnect()
    const { name, description, price, category } = await request.json()
    const service = new Service({ name, description, price, category })
    await service.save()
    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}

// Read Services
export const GET = async () => {
  try {
    await dbConnect()
    const services = await Service.find()
    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

// Update Service
export const PATCH = async (request: Request) => {
  try {
    await dbConnect()
    const { id, name, description, price, category } = await request.json()
    const updatedService = await Service.findByIdAndUpdate(id, { name, description, price, category }, { new: true })
    return NextResponse.json(updatedService)
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

// Delete Service
export const DELETE = async (request: Request) => {
  try {
    await dbConnect()
    const { id } = await request.json()
    await Service.findByIdAndDelete(id)
    return NextResponse.json({ message: "Service deleted" }, { status: 204 })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}

