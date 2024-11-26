// src/lib/mongoose.ts
import mongoose from 'mongoose';

// Explicitly declare 'cached' with proper type safety
let cached = global.mongoose as { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null } | undefined;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!).then((mongooseInstance) => {
      cached!.conn = mongooseInstance.connection;
      return cached!.conn;
    });
  }

  return cached.promise;
};

export default connectToDatabase;
