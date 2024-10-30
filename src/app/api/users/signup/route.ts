// src/app/api/users/signup/route.ts

import { connectToDatabase } from '@/lib/mongodb'; // Use named import
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const { db } = await connectToDatabase();

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user in the database
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
    });

    return res.status(201).json(result);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
