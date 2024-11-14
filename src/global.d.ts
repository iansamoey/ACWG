// src/global.d.ts
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };

  let _mongoClientPromise: Promise<MongoClient> | undefined;

  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      NEXT_PUBLIC_API_URL: string;
      NEXTAUTH_SECRET?: string;
    }
  }
}

export {};
