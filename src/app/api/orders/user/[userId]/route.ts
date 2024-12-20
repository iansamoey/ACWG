import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { writeFile } from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

// GET: Fetch user orders
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { userId } = await context.params;  // Await the Promise

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments({ userId });
    const totalPages = Math.ceil(totalOrders / limit);

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { message: "No orders found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orders,
      currentPage: page,
      totalPages,
      totalOrders
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Error fetching user orders" },
      { status: 500 }
    );
  }
}

// POST: Create a new order
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  const { userId } = await context.params;  // Await the Promise

  await dbConnect();

  try {
    const formData = await request.formData();
    const serviceName = formData.get("serviceName") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const total = Number(formData.get("total"));
    const status = (formData.get("status") as string) || "pending";

    if (!serviceName || !description || !price || !total) {
      return NextResponse.json(
        {
          error: "Invalid request: serviceName, description, price, and total are required",
        },
        { status: 400 }
      );
    }

    const attachments = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("attachment") && value instanceof File) {
        const filename = value.name;
        const buffer = Buffer.from(await value.arrayBuffer());
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        attachments.push({
          filename: filename,
          path: `/uploads/${filename}`,
        });
      }
    }

    const newOrder = new Order({
      userId,
      serviceName,
      description,
      price,
      total,
      status,
      attachments,
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
