import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

// PUT request to update order status
export async function PUT(req: NextRequest, context: { params: { orderId: string } }) {
  await dbConnect();
  const { orderId } = context.params;
  const { status } = await req.json();

  // Validate the status input
  const validStatuses = ["Pending", "In Progress", "Completed", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
