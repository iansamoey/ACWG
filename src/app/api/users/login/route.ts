import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(request: Request) {
    const { username, password } = await request.json();

    try {
        await client.connect();
        const db = client.db();

        // Find the user
        const user = await db.collection('users').findOne({ username });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Compare passwords
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
        }

        // User login successful
        return NextResponse.json({ message: 'Login successful' });
    } catch (error) {
        return NextResponse.json({ message: 'Error logging in' }, { status: 500 });
    } finally {
        await client.close();
    }
}
