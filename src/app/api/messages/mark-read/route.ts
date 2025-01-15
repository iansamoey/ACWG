import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Message from '@/models/Message';

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { messageIds } = await req.json();

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json({ error: 'Invalid messageIds' }, { status: 400 });
    }

    const result = await Message.updateMany(
      { 
        _id: { $in: messageIds },
        receiverId: session.user.id, // Ensure only messages received by the current user are marked as read
        read: false // Only update unread messages
      },
      { $set: { read: true } }
    );

    return NextResponse.json({ 
      success: true, 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

