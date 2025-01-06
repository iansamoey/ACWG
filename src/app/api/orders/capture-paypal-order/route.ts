import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { sendOrderConfirmationEmail } from "@/lib/email";

const PAYPAL_BASE_URL = "https://api.paypal.com";

interface PayPalError {
  name: string;
  details: Array<{
    issue: string;
    description: string;
  }>;
  message: string;
  debug_id: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  pages: number;
  totalWords: number;
  attachment?: string;
}

interface CaptureData {
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
      }>;
    };
  }>;
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { orderId, userId, items, total } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "PayPal configuration is missing" },
        { status: 500 }
      );
    }

    const accessToken = await getPayPalAccessToken();
    
    try {
      const captureData = await capturePayPalOrder(accessToken, orderId);

      if ((captureData as CaptureData).status === "COMPLETED") {
        const totalPages = items.reduce(
          (sum: number, item: OrderItem) => sum + item.pages * item.quantity,
          0
        );
        const totalWords = items.reduce(
          (sum: number, item: OrderItem) =>
            sum + (item.totalWords || item.pages * 250) * item.quantity,
          0
        );

        const orderData = {
          userId,
          items,
          total,
          status: "pending" as const,
          paymentStatus: "paid" as const,
          paypalOrderId: orderId,
          paypalTransactionId: (captureData as CaptureData).purchase_units[0].payments.captures[0].id,
          serviceName: (items[0] as OrderItem).name,
          description: `Order for ${(items as OrderItem[])
            .map((item) => item.name)
            .join(", ")}`,
          pages: totalPages,
          totalWords: totalWords,
          attachments: items.flatMap((item: OrderItem) =>
            item.attachment
              ? [
                  {
                    filename: item.attachment.split("/").pop() || "",
                    path: item.attachment,
                  },
                ]
              : []
          ),
        };

        const order = await Order.create(orderData);

        if (!order || !order._id) {
          throw new Error("Failed to create order in database");
        }

        const user = await User.findById(userId);
        if (user) {
          await sendOrderConfirmationEmail(
            user.email,
            user.name,
            order._id.toString(),
            items
          );
        }

        return NextResponse.json({ success: true, order });
      } else {
        return NextResponse.json(
          {
            error: "Payment not completed",
            details: captureData,
          },
          { status: 400 }
        );
      }
    } catch (captureError: any) {
      // Handle specific PayPal errors
      if (captureError.name === "UNPROCESSABLE_ENTITY") {
        const paypalError = captureError as PayPalError;
        const detail = paypalError.details[0];
        
        if (detail.issue === "INSTRUMENT_DECLINED") {
          return NextResponse.json(
            {
              error: "Payment method declined",
              message: "Your payment method was declined. Please try a different payment method.",
              details: detail.description,
              debug_id: paypalError.debug_id
            },
            { status: 422 }
          );
        }
      }

      throw captureError; // Re-throw other errors to be caught by outer try-catch
    }
  } catch (error: any) {
    console.error("Error capturing PayPal order:", error);
    
    // Return a user-friendly error message
    return NextResponse.json(
      {
        error: "Payment processing failed",
        message: "There was an error processing your payment. Please try again.",
        details: error instanceof Error ? error.message : String(error),
        debug_id: error.debug_id
      },
      { status: 500 }
    );
  }
}

async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("PayPal API Error (Access Token):", errorData);
    throw new Error(`PayPal API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as { access_token: string };
  return data.access_token;
}

async function capturePayPalOrder(
  accessToken: string,
  orderId: string
): Promise<unknown> {
  const response = await fetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(`PayPal API error: ${response.status} ${response.statusText}`) as any;
    error.name = data.name;
    error.details = data.details;
    error.debug_id = data.debug_id;
    throw error;
  }

  return data;
}

