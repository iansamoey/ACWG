// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db'; // Adjust the import based on your project structure
import User from '@/models/User'; // Adjust the import based on your project structure
import bcrypt from 'bcrypt';

export async function GET() {
    await dbConnect();

    try {
        const users = await User.find(); // Retrieve all users
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const { id, username, email, password } = await request.json(); // Expecting user id and data to update

    await dbConnect();

    try {
        const updateData: any = { username, email };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10); // Hash the new password if provided
        }
        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json({ message: 'User updated successfully', user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { id } = await request.json(); // Expecting user id to delete

    await dbConnect();

    try {
        await User.findByIdAndDelete(id); // Delete user by id
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
