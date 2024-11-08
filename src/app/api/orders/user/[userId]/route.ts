import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

// POST Method: Create a new order for a user
export async function POST(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  await dbConnect();
  const { userId } = context.params;

  try {
    const { items, total, status } = await req.json();

    // Validate the request body
    if (!items || !total || typeof total !== "number") {
      return NextResponse.json(
        { error: "Invalid request: items and total are required" },
        { status: 400 }
      );
    }

    const [item] = items;
    const { serviceName, description, price } = item;

    // Create a new order
    const newOrder = new Order({
      userId,
      serviceName,
      description,
      price,
      total,
      status: status || "pending", // Default status
      createdAt: new Date(),
    });

    // Save order to database
    const savedOrder = await newOrder.save();
    return NextResponse.json(savedOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}

// GET Method: Fetch user details by userId
export async function GET(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  await dbConnect();
  const { userId } = context.params;

  try {
    // Fetch user details by userId
    const user = await User.findById(userId).select("username email");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Error fetching user details" },
      { status: 500 }
    );
  }
}
