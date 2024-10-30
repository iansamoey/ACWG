import { NextResponse } from 'next/server';

// Mock user profile data for demonstration
const mockProfile = {
    name: 'John Doe',
    email: 'johndoe@example.com',
};

export async function GET() {
    return NextResponse.json(mockProfile);
}
