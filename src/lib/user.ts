// src/models/User.ts
import { ObjectId } from 'mongodb';

export interface User {
    _id?: ObjectId;
    username: string;
    password: string; // Ensure this is hashed before storing
}

