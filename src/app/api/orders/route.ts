import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users", // Make sure this matches your users collection name
          let: { userId: { $toObjectId: "$userId" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            { $project: { username: 1, email: 1 } }
          ],
          as: "userDetails"
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
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
          attachments: 1,
          "userDetails.username": 1,
          "userDetails.email": 1
        }
      }
    ]);

    console.log("Fetched orders:", JSON.stringify(orders, null, 2)); // Debug log

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}