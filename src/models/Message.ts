import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  attachment?: {
    filename: string;
    contentType: string;
    url: string;
  };
  parentMessageId?: string;
}

const MessageSchema: Schema = new Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  attachment: {
    filename: { type: String },
    contentType: { type: String },
    url: { type: String }
  },
  parentMessageId: { type: String, default: null },
});

const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;

