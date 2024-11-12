import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { ArrowBigLeftIcon } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaymentMessage from "./PaymentMessage";
import { setUser } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateUserBalance } from "@/actions/balance/updateUserBalance";
import { redirect } from "@/i18n/routing";

export default function StripePaymentForm({ goBack, amount, trans }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const cardElement = elements?.getElement("card");
    try {
      if (!stripe || !cardElement) return null;
      const { data } = await axios.post(
        "/api/checkout/stripe/create-payment-intent",
        {
          data: { amount: Number(amount) },
        }
      );

      const client_secret = data;

      const { paymentIntent } = await stripe?.confirmCardPayment(
        client_secret,
        {
          payment_method: { card: cardElement },
        }
      );
      console.log("from confirm card payment", paymentIntent?.status);

      switch (paymentIntent?.status) {
        case "canceled":
          setPaymentMessage({
            status: "error",
            message: `Sorry, your transaction could not be processed...${paymentIntent?.status}`,
          });
          break;
        case "succeeded":
          dispatch(
            setUser({
              ...user,
              balance: Number(user.balance) + Number(amount),
            })
          );

          await updateUserBalance(
            user?.id,
            `${Number(user.balance) + Number(amount)}`,
            ``
          );
          setPaymentMessage({
            status: "COMPLETED",
            id: paymentIntent.id,
            payerName: `${user.name}`,
            updatedBalance: Number(user.balance) + Number(amount),
            message: `Your payment was successfull.`,
          });
          break;
        default:
          break;
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return paymentMessage === null ? (
    <div className=" w-full md:w-[600px] relative md:h-full mt-12 md:m-0 grid gap-6">
      <div
        className="absolute top-[-48px] cursor-pointer flex items-center hover:translate-x-[-12px] duration-500 "
        onClick={goBack}
      >
        <ArrowBigLeftIcon strokeWidth={1} /> <p>{trans("goBackBtn")}</p>
      </div>
      <div className="relative">
        <form onSubmit={onSubmit} className=" grid gap-6">
          <CardElement />
          <Button
            disabled={loading}
            variant={"default"}
            className="w-full disabled:cursor-not-allowed"
            type="submit"
          >
            {loading ? trans("btnLoading") : trans("payBtn")}
          </Button>
        </form>
      </div>
    </div>
  ) : (
    <PaymentMessage
      isOpen={true}
      onClose={() => {
        redirect("/");
        goBack(); // go back to topup page
      }}
      paymentStatus={paymentMessage?.status} // 'COMPLETED' | 'error'
      payerName={paymentMessage?.payerName}
      updatedBalance={paymentMessage?.updatedBalance}
      id={paymentMessage?.id}
      message={paymentMessage?.message} // both success message or error message
    />
  );
}
