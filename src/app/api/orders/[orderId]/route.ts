import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req: NextRequest, context: { params: Promise<{ orderId: string }> }) {
  await dbConnect();

  // Await context.params to extract orderId safely
  const { orderId } = await context.params;

  try {
    // Fetch order based on orderId
    const order = await Order.findById(orderId);

    // Handle case when no order is found
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Return the found order
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}