import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';

// Define a type for the update data
interface UpdateUserData {
    username?: string;
    email?: string;
    password?: string;
}

export async function GET() {  // Removed the unused 'request' parameter here
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!session.user?.isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const users = await User.find({}, 'username email _id');
        return NextResponse.json(users, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching users:', error.message);
            return NextResponse.json({ error: 'Failed to fetch users', details: error.message }, { status: 500 });
        }
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Failed to fetch users', details: 'Unknown error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!session.user?.isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id, username, email, password } = await request.json();

        const updateData: UpdateUserData = { username, email };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User updated successfully', user }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error updating user:', error.message);
            return NextResponse.json({ error: 'Failed to update user', details: error.message }, { status: 500 });
        }
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Failed to update user', details: 'Unknown error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!session.user?.isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await request.json();

        const deletedUser = await User.findByIdAndDelete(id);
        
        if (!deletedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error deleting user:', error.message);
            return NextResponse.json({ error: 'Failed to delete user', details: error.message }, { status: 500 });
        }
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Failed to delete user', details: 'Unknown error' }, { status: 500 });
    }
}
