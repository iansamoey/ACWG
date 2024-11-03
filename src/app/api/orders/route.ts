// src/app/api/orders/route.ts

import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    await dbConnect(); // Ensure database connection

    try {
        const body = await req.json();

        // Validate request body
        if (!body.userId || !body.items || !body.total) {
            return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
        }

        // Create new order document
        const order = new Order({
            userId: body.userId,
            items: body.items,
            total: body.total,
            status: 'pending'
        });

        const savedOrder = await order.save();
        return NextResponse.json(savedOrder, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
    }
}
