import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const data = await request.json();
    // Process the request data here
    console.log('Request received:', data);

    return NextResponse.json({ message: 'Request submitted successfully!' });
}
