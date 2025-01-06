import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

const PAYPAL_BASE_URL = "https://api.paypal.com";

interface PayPalTokenResponse {
  access_token: string;
  [key: string]: unknown;
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { total } = await req.json();

    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      throw new Error("PayPal credentials are not configured");
    }

    const accessToken = await getPayPalAccessToken();
    const order = await createPayPalOrder(accessToken, total);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json(
      { 
        error: "Failed to create PayPal order",
        details: error instanceof Error ? error.message : String(error)
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

  const data = (await response.json()) as PayPalTokenResponse;
  return data.access_token;
}

async function createPayPalOrder(
  accessToken: string,
  total: number
): Promise<unknown> {
  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total.toFixed(2),
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("PayPal API Error (Create Order):", errorData);
    throw new Error(`PayPal API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

