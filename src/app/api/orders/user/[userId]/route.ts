import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function POST(req: NextRequest, context: { params: { userId: string } }) {
  await dbConnect();
  const { userId } = context.params;

  try {
    const { items, total, status } = await req.json();

    // Validate the request body
    if (!items || !total || typeof total !== 'number') {
      return NextResponse.json({ error: 'Invalid request: items and total are required' }, { status: 400 });
    }

    const [item] = items;
    const { serviceName, description, price } = item;

    // Create a new order
    const newOrder = new Order({
      userId,
      serviceName,
      description,
      price,
      total,
      status: status || 'pending', // Default status
      createdAt: new Date(),
    });

    // Save order to database
    const savedOrder = await newOrder.save();
    return NextResponse.json(savedOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while processing the request' }, { status: 500 });
  }
}
