import { NextResponse } from 'next/server';

// Mock data for demonstration
const mockOrders = [
    { id: '1', title: 'Order 1', status: 'Pending' },
    { id: '2', title: 'Order 2', status: 'Completed' },
    { id: '3', title: 'Order 3', status: 'In Progress' },
];

export async function GET() {
    return NextResponse.json(mockOrders);
}
