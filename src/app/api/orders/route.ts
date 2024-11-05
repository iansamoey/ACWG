import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db'; // Adjust this path as necessary
import Order from '@/models/Order'; // Adjust this path as necessary
import { getSession } from 'next-auth/react'; // If using NextAuth for user sessions

export async function POST(request: Request) {
  const session = await getSession(); // Get the user session
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  
  // Create a new order with userId and cart items
  try {
    await dbConnect(); // Ensure database connection is established
    const newOrder = await Order.create({
      userId: session.user.id, // Assuming session.user.id contains the user ID
      items: body.items,
      total: body.total,
      status: 'Pending', // Adjust based on your order status logic
      createdAt: new Date(),
    });
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating order' }, { status: 500 });
  }
}
