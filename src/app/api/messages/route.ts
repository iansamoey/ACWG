import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Message, { IMessage } from '@/models/Message';
import { supabase, getPublicUrl } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');

  try {
    let messages;
    if (session.user.isAdmin) {
      if (userId) {
        messages = await Message.find({
          $or: [{ senderId: userId }, { receiverId: userId }]
        }).sort({ timestamp: 1 });
      } else {
        messages = await Message.find().sort({ timestamp: 1 });
      }
    } else {
      messages = await Message.find({
        $or: [{ senderId: session.user.id }, { receiverId: session.user.id }]
      }).sort({ timestamp: 1 });
    }

    return NextResponse.json(messages);
  } catch (error: unknown) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const content = formData.get('content') as string;
    const senderId = formData.get('senderId') as string;
    const senderName = formData.get('senderName') as string;
    const receiverId = formData.get('receiverId') as string;
    const parentMessageId = formData.get('parentMessageId') as string | null;
    const file = formData.get('attachment') as File | null;

    if (!content || !senderId || !senderName || !receiverId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMessage: Partial<IMessage> = {
      senderId,
      senderName,
      receiverId,
      content,
      timestamp: new Date(),
    };

    if (parentMessageId) {
      newMessage.parentMessageId = parentMessageId;
    }

    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const { error } = await supabase.storage
          .from('attachments')
          .upload(fileName, file);

        if (error) {
          console.error('Supabase upload error:', error);
          return NextResponse.json({ error: `Failed to upload file: ${error.message}` }, { status: 500 });
        }

        const publicUrl = getPublicUrl('attachments', fileName);

        if (!publicUrl) {
          console.error('Failed to get public URL for uploaded file');
          return NextResponse.json({ error: 'Failed to get public URL for uploaded file' }, { status: 500 });
        }

        newMessage.attachment = {
          filename: file.name,
          contentType: file.type,
          url: publicUrl,
        };
      } catch (uploadError: unknown) {
        console.error('Unexpected error during file upload:', uploadError);
        return NextResponse.json({ error: 'Unexpected error during file upload' }, { status: 500 });
      }
    }

    const message = new Message(newMessage);
    
    try {
      await message.validate();
    } catch (validationError: unknown) {
      console.error('Validation error:', validationError);
      return NextResponse.json({ 
        error: 'Message validation failed', 
        details: (validationError as Error).message 
      }, { status: 400 });
    }

    await message.save();

    return NextResponse.json(message);
  } catch (error: unknown) {
    console.error('Error creating message:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}

