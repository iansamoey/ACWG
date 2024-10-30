import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(request: Request) {
    const { username, password } = await request.json();

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
        await db.collection('users').insertOne({ username, password: hashedPassword });

        return NextResponse.json({ message: 'User registered successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Error registering user' }, { status: 500 });
    } finally {
        await client.close();
    }
}
