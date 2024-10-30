import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let isConnected = false; // Track the connection state

async function dbConnect() {
    if (isConnected) {
        return; // Use existing connection
    }

    const options: ConnectOptions = {
        // Remove the following line
        // useUnifiedTopology: true,
        // useNewUrlParser: true, // also optional
        // Optionally add any other options if needed
    };

    try {
        await mongoose.connect(MONGODB_URI, options);
        isConnected = true; // Set connection state
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error; // Rethrow to handle further up the stack
    }
}

export default dbConnect;
