import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(request: Request) {
    const { username, email, password } = await request.json();

    try {
        await client.connect();
        const db = client.db();

        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ username });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to the database
        await db.collection('users').insertOne({ username, email, password: hashedPassword });

        return NextResponse.json({ message: 'User registered successfully' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error registering user:', error.message); // Log the error message
            return NextResponse.json({ message: 'Error registering user', details: error.message }, { status: 500 });
        }
        // Handle unexpected errors
        console.error('Unexpected error:', error);
        return NextResponse.json({ message: 'Error registering user', details: 'Unknown error' }, { status: 500 });
    } finally {
        await client.close();
    }
}
