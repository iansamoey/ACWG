// src/app/api/admin/create/route.ts
import { NextResponse } from 'next/server';
import User from '@/models/User'; // Adjust the import based on your project structure
import dbConnect from '@/lib/db'; // Import your DB connection utility
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

export async function POST(req: Request) {
  await dbConnect(); // Connect to the database
  const { username, email, password } = await req.json();

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new admin with the hashed password
    const newAdmin = new User({ 
      username, 
      email, 
      password: hashedPassword, // Use the hashed password
      isAdmin: true, // Ensure that isAdmin is set to true for admin accounts
    });

    await newAdmin.save();
    return NextResponse.json({ message: 'Admin created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}
