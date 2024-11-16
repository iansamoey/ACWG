import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  await dbConnect();

  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users", // Collection name for users
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          serviceName: 1,
          description: 1,
          price: 1,
          total: 1,
          status: 1,
          createdAt: 1,
          attachments: 1, // Include attachments in the projection
          "userDetails.username": 1,
          "userDetails.email": 1,
        },
      },
    ]);

    console.log("Fetched orders:", JSON.stringify(orders, null, 2)); // Debug log

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}