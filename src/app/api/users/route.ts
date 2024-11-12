import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db'; // Adjust the import based on your project structure
import User from '@/models/User'; // Adjust the import based on your project structure
import bcrypt from 'bcrypt';

// Define a type for the update data
interface UpdateUserData {
    username?: string;
    email?: string;
    password?: string;
}

export async function GET() {
    await dbConnect();

    try {
        const users = await User.find(); // Retrieve all users
        return NextResponse.json(users, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) { // Type guard to ensure it's an instance of Error
            console.error('Error fetching users:', error.message); // Log the error message
            return NextResponse.json({ error: 'Failed to fetch users', details: error.message }, { status: 500 });
        }
        console.error('Unexpected error:', error); // Handle unexpected errors
        return NextResponse.json({ error: 'Failed to fetch users', details: 'Unknown error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const { id, username, email, password } = await request.json(); // Expecting user id and data to update

    await dbConnect();

    try {
        // Use the UpdateUserData type for updateData
        const updateData: UpdateUserData = { username, email };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10); // Hash the new password if provided
        }
        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json({ message: 'User updated successfully', user }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) { // Type guard to ensure it's an instance of Error
            console.error('Error updating user:', error.message); // Log the error message
            return NextResponse.json({ error: 'Failed to update user', details: error.message }, { status: 500 });
        }
        console.error('Unexpected error:', error); // Handle unexpected errors
        return NextResponse.json({ error: 'Failed to update user', details: 'Unknown error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { id } = await request.json(); // Expecting user id to delete

    await dbConnect();

    try {
        await User.findByIdAndDelete(id); // Delete user by id
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) { // Type guard to ensure it's an instance of Error
            console.error('Error deleting user:', error.message); // Log the error message
            return NextResponse.json({ error: 'Failed to delete user', details: error.message }, { status: 500 });
        }
        console.error('Unexpected error:', error); // Handle unexpected errors
        return NextResponse.json({ error: 'Failed to delete user', details: 'Unknown error' }, { status: 500 });
    }
}
