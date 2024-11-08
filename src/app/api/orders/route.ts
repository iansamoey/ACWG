import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User"; // Ensure you have imported your User model

export async function GET() {
  await dbConnect();

  try {
    // Fetch orders with user details using aggregation or populate (if you have user references)
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
          "userDetails.username": 1,
          "userDetails.email": 1,
        },
      },
    ]);

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}
