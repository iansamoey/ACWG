import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/db';

export async function GET(req: Request) {
  await dbConnect();
  try {
    const users = await User.find();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
