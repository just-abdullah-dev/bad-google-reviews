import { NextResponse } from "next/server";
import fetch from "node-fetch";

const PAYPAL_CLIENT_ID = `${process.env.PAYPAL_CLIENT_ID}`;
const PAYPAL_CLIENT_SECRET_KEY = `${process.env.PAYPAL_CLIENT_SECRET_KEY}`;
const base = "https://api-m.sandbox.paypal.com";

// Helper function to generate PayPal access token
async function generateAccessToken() {
  const BASE64_ENCODED_CLIENT_ID_AND_SECRET = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET_KEY}`
  ).toString("base64");

  const request = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${BASE64_ENCODED_CLIENT_ID_AND_SECRET}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  const json = await request.json();
  return json.access_token;
}

// Helper function to handle API response
async function handleResponse(response) {
  const jsonResponse = await response.json();
  return {
    jsonResponse,
    httpStatusCode: response.status,
  };
}

// Create an order in PayPal
const createOrder = async (amount, user) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;

  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "EUR",
          value: `${amount}`,
        },
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// API route to create an order
export async function POST(req) {
  try {
    const { amount, user } = await req.json(); // Assuming cart data is sent in the request body
    const { jsonResponse, httpStatusCode } = await createOrder(amount, user);

    return NextResponse.json(jsonResponse, { status: httpStatusCode });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order." },
      { status: 500 }
    );
  }
}
