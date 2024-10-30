import mongoose, { Document, Schema } from 'mongoose';

export interface IEssayRequest extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    content: string;
    status: string;
}

const EssayRequestSchema: Schema<IEssayRequest> = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    status: { type: String, default: 'pending' },
}, { timestamps: true });

const EssayRequest = mongoose.model<IEssayRequest>('EssayRequest', EssayRequestSchema);

export default EssayRequest;
