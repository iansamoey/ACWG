import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/db';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await dbConnect();
  try {
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await dbConnect();
  const { email, password, isAdmin } = await req.json();
  try {
    const user = await User.findByIdAndUpdate(params.id, { email, password, isAdmin }, { new: true });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await dbConnect();
  try {
    await User.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
