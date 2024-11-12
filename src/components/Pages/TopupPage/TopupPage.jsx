"use client";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import PayPal from "./PayPal";
import Stripe from "./Stripe";
import { getUserWithBalance } from "@/actions/balance/getUserWithBalance";
import { setUser } from "@/store/userSlice";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useTranslations } from "next-intl";
import { redirect } from "@/i18n/routing";

export default function TopupPage() {
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const trans = useTranslations("TopupPage");

  useEffect(() => {
    const main = async () => {
      setIsLoading(true);
      try {
        const data = await getUserWithBalance();
        dispatch(setUser(data));
        if (data?.isAdmin) {
          redirect("/");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        toast.error("Kindly login first!");
        redirect("/");
        setIsLoading(false);
      }
    };
    if (!user.id) {
      main();
    } else {
      if (user?.isAdmin) {
        redirect("/");
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    paymentMethod: "",
    amount: 0.0,
  });
  const [startPayPalCheckout, setStartPayPalCheckout] = useState(false);

  const [startStripeCheckout, setStartStripeCheckout] = useState(false);
  const goBack = () => {
    setStartPayPalCheckout(false);
    setStartStripeCheckout(false);
  };
  const handleSubmit = () => {
    if (!formData?.paymentMethod) {
      toast.error("Kindly select payment method.");
      return;
    } else if (formData?.amount === 0) {
      toast.error("Kindly enter an amount to topup.");
      return;
    }
    if (formData?.paymentMethod === "paypal") {
      setStartPayPalCheckout(true);
      setStartStripeCheckout(false);
    } else if (formData?.paymentMethod === "stripe") {
      setStartPayPalCheckout(false);
      setStartStripeCheckout(true);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <div className=" grid md:place-items-center py-4 px-8 min-h-[calc(100vh-64px)] max-h-fit w-full">
        {startPayPalCheckout ? (
          <div>
            <PayPal trans={trans} amount={formData?.amount} goBack={goBack} />
          </div>
        ) : startStripeCheckout ? (
          <div>
            <Stripe trans={trans} amount={formData?.amount} goBack={goBack} />
          </div>
        ) : (
          <div className=" w-full md:w-[600px] md:h-full grid gap-6">
            <div className=" text-center grid md:gap-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {trans("title")}
              </h1>
              <p className=" text-gray-800 text-sm md:text-base">
                {trans("p")}
              </p>
            </div>
            <div className="grid gap-2">
              <h1 className=" font-semibold text-xl md:text-2xl">
                {trans("heading1")}
              </h1>
              <p className="text-center font-semibold text-3xl md:text-4xl">
                {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{" "}
                {Number(user.balance).toFixed(2)}
              </p>
            </div>
            <div className="grid gap-2">
              <h1 className=" font-semibold text-xl md:text-2xl">
                {trans("heading2")}
              </h1>

              <div className="flex items-center justify-around">
                <div
                  className={`${
                    formData?.paymentMethod === "paypal"
                      ? " border-blue-500 "
                      : " border-transparent  "
                  } border-2 p-8 rounded-2xl group cursor-pointer aspect-square `}
                  onClick={() => {
                    setFormData((prev) => {
                      return { ...prev, paymentMethod: "paypal" };
                    });
                  }}
                >
                  <Image
                    src="/paypal.png"
                    className=" aspect-auto group-hover:scale-[1.06] duration-300 transition-all"
                    alt="paypal logo"
                    width={100}
                    height={100}
                  />
                </div>
                <div
                  className={`${
                    formData?.paymentMethod === "stripe"
                      ? " border-blue-500 "
                      : " border-transparent "
                  } border-2 p-8 rounded-2xl group cursor-pointer aspect-square `}
                  onClick={() => {
                    setFormData((prev) => {
                      return { ...prev, paymentMethod: "stripe" };
                    });
                  }}
                >
                  <Image
                    src="/stripe.png"
                    className=" aspect-auto group-hover:scale-[1.06] duration-300 transition-all"
                    alt="stripe logo"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            </div>
            <div className=" grid gap-2">
              <h1 className=" font-semibold text-xl md:text-2xl">
                {trans("heading3")}
              </h1>
              <div className="grid w-full items-center gap-2 mb-4">
                <Label htmlFor="amount">{trans("inputAmountLabel")}</Label>
                <Input
                  type="number"
                  className=" bg-white"
                  id="amount"
                  placeholder="Enter your Google Map Link"
                  value={formData?.amount}
                  onChange={(e) => {
                    setFormData((prev) => {
                      return { ...prev, amount: e.target.value };
                    });
                  }}
                />
              </div>
              <Button className="w-full" onClick={handleSubmit}>
                {trans("actionBtn")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
