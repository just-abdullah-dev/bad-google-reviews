"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "./StripePaymentForm";

const stripePromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
);

export default function Stripe({goBack, amount, trans}) {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm trans={trans} amount={amount} goBack={goBack} />
    </Elements>
  );
}