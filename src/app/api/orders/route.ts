// File: src/app/api/orders/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { service, date, details, total } = await request.json();

        if (!service || !date || !details || !total) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        const newOrder = new Order({
            service,
            date,
            details,
            total,
            status: 'pending', // Or any initial status you prefer
            createdAt: new Date(),
        });

        await newOrder.save();
        
        return NextResponse.json({ message: 'Order saved successfully', order: newOrder }, { status: 201 });
    } catch (error) {
        console.error('Error saving order:', error);
        return NextResponse.json(
            { error: 'Failed to save order' },
            { status: 500 }
        );
    }
}
