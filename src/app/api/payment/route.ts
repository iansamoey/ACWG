import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    // Your payment handling logic here
    return NextResponse.json({ message: "Payment processed" });
}
