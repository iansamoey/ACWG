import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

dbConnect();

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;
    
    // Fetch orders for the user
    const orders = await Order.find({ userId }).populate('userId');

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 });
  }
}
