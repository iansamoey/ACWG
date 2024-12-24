import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  await dbConnect();

  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users",
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
        $addFields: {
          paymentStatus: {
            $cond: {
              if: { $ne: ["$paypalTransactionId", null] },
              then: "paid",
              else: "unpaid"
            }
          }
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
          paymentStatus: 1,
          createdAt: 1,
          attachments: 1,
          paypalOrderId: 1,
          paypalTransactionId: 1,
          "userDetails.username": 1,
          "userDetails.email": 1,
          pages: 1,
          totalWords: 1
        }
      }
    ]);

    console.log("Fetched orders:", JSON.stringify(orders, null, 2));

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}

