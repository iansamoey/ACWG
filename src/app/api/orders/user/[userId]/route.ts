import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

// Consolidated handler for POST and GET methods
export async function handler(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  await dbConnect();
  const { userId } = context.params;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // Handle POST Method: Create a new order
  if (req.method === "POST") {
    try {
      // Parse the request body
      const { items, total, status } = await req.json();

      // Validate the request body
      if (!items || !Array.isArray(items) || items.length === 0 || typeof total !== "number") {
        return NextResponse.json(
          { error: "Invalid request: items and total are required" },
          { status: 400 }
        );
      }

      // Extract service details from the first item in the order
      const [item] = items;
      const { serviceName, description, price } = item;

      // Create a new order
      const newOrder = new Order({
        userId,
        serviceName,
        description,
        price,
        total,
        status: status || "pending",
        createdAt: new Date(),
      });

      // Save the order to the database
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

  // Handle GET Method: Fetch all orders for a user
  if (req.method === "GET") {
    try {
      // Fetch all orders for the given userId
      const userOrders = await Order.find({ userId }).sort({ createdAt: -1 });

      // Check if orders exist
      if (!userOrders || userOrders.length === 0) {
        return NextResponse.json(
          { message: "No orders found for this user" },
          { status: 404 }
        );
      }

      // Return the user's orders
      return NextResponse.json(userOrders, { status: 200 });
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return NextResponse.json(
        { error: "Error fetching user orders" },
        { status: 500 }
      );
    }
  }

  // If method is not supported
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

// Export consolidated handler for dynamic routing
export { handler as GET, handler as POST };
