// src/global.d.ts

import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

declare global {
  // Declare mongoose connection globally to avoid reconnecting each time
  const mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };

  // Declare MongoDB client promise globally to manage connections in serverless functions
  let _mongoClientPromise: Promise<MongoClient> | undefined;

  // Add environment variable types
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      NEXT_PUBLIC_API_URL: string;
      NEXTAUTH_SECRET?: string;
      // Add other environment variables here as needed
    }
  }
}

export {}; // Ensures this file is treated as a module
