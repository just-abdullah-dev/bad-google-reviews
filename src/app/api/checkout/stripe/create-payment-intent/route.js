import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: false,
  apiVersion: "2022-11-15",
});

export async function POST(req) {
  const { data } = await req.json();
  const { amount } = data;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "EUR",
    });
    console.log(
      "From Backend /api/checkout/stripe/create-payment-intent",
      paymentIntent
    );

    return new NextResponse(paymentIntent.client_secret, { status: 200 });
  } catch (error) {
    return new NextResponse(error, {
      status: 400,
    });
  }
}
