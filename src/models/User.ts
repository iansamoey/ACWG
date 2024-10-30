// src/models/User.ts

import mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId; // Keep as ObjectId
  email: string;
  password: string;
  isAdmin: boolean;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: { type: Boolean, default: false },
});

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;
