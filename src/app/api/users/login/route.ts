// src/app/api/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

export async function POST(request: Request) {
    const { identifier, password } = await request.json();

    try {
        await client.connect();
        const db = client.db();

        // Find the user by username or email
        const user = await db.collection('users').findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });
        
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Compare passwords
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
        }

        // User login successful
        return NextResponse.json({
            message: 'Login successful',
            userId: user._id, // Send user ID along with user data
            email: user.email,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        return NextResponse.json({ message: 'Error logging in' }, { status: 500 });
    } finally {
        await client.close();
    }
}
