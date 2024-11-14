import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  await dbConnect();

  const { userId } = await context.params;

  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { message: "No orders found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Error fetching user orders" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  await dbConnect();

  const { userId } = await context.params;

  try {
    const { items, total, status } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0 || typeof total !== "number") {
      return NextResponse.json(
        { error: "Invalid request: items and total are required" },
        { status: 400 }
      );
    }

    const [item] = items;
    const { serviceName, description, price } = item;

    const newOrder = new Order({
      userId,
      serviceName,
      description,
      price,
      total,
      status: status || "pending",
      createdAt: new Date(),
    });

    const savedOrder = await newOrder.save();
    return NextResponse.json(savedOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}