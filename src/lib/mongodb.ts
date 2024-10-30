// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://Admin:Admin123@georgia.xetsq.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    // Use a global variable to preserve the MongoClient instance in development
    if (!global._mongoClientPromise) {
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production, create a new client each time
    clientPromise = client.connect();
}

export default clientPromise;
