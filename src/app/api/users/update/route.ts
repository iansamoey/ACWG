import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function PUT(req: NextRequest) {
  await dbConnect();
  const { email, password, contactInfo } = await req.json();

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password, contactInfo },
      { new: true }
    );

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
