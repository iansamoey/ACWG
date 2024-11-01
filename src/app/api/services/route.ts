// src/app/api/services/route.ts
import { NextResponse } from 'next/server';
import Service from '../../../models/Service';

// Create Service
export const POST = async (request: Request) => {
  const { name, description, price } = await request.json();
  const service = new Service({ name, description, price });
  await service.save();
  return NextResponse.json(service, { status: 201 });
};

// Read Services
export const GET = async () => {
  const services = await Service.find();
  return NextResponse.json(services);
};

// Update Service
export const PATCH = async (request: Request) => {
  const { id, name, description, price } = await request.json();
  const updatedService = await Service.findByIdAndUpdate(
    id,
    { name, description, price },
    { new: true }
  );
  return NextResponse.json(updatedService);
};

// Delete Service
export const DELETE = async (request: Request) => {
  const { id } = await request.json();
  await Service.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Service deleted' }, { status: 204 });
};
