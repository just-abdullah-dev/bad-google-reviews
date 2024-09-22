import { NextResponse } from "next/server";
import fetch from "node-fetch";

// Environment variables
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

// Capture an order by its orderID
const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

// API route to capture an order
export async function POST(req, { params }) {
  try {
    const { orderID } = params; // Get orderID from route params
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    
    return NextResponse.json(jsonResponse, { status: httpStatusCode });
  } catch (error) {
    console.error("Failed to capture order:", error);
    return NextResponse.json(
      { error: "Failed to capture order." },
      { status: 500 }
    );
  }
}
