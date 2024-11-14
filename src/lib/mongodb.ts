// src/lib/mongoose.ts
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then((mongooseInstance) => {
      cached.conn = mongooseInstance.connection;
      return cached.conn;
    });
  }

  return cached.promise;
};

export default connectToDatabase;
