import React from "react";
import Layout from "../../Layout/Layout";
import OrderForm from "./OrderForm";

export default function HomePage() {
  return (
    <Layout>
      <div className="grid place-items-center gap-4 md:gap-16 py-4 px-8 min-h-[calc(100vh-64px)]">
        <h1 className=" text-[40px] sm:text-6xl md:text-8xl font-[600] tracking-tighter leading-tight text-center">
          Few <span className="text-[#4286f5]">S</span>
          <span className="text-[#dc4437]">i</span>
          <span className="text-[#f5b400]">m</span>
          <span className="text-[#4286f5]">p</span>
          <span className="text-[#109d58]">l</span>
          <span className="text-[#dc4437]">e</span> Steps
        </h1>
        <div className="w-full h-full">
          <div className="flex flex-col md:flex-row md:gap-6 ">
            <div className=" w-full md:w-[65%] text-base md:text-lg space-y-4 md:border-r-2 border-black">
              <div>
                <h1 className="font-semibold">1- Topup Balance</h1>
                <p className="pl-4">
                  Add funds to your account to cover the cost of removing the
                  negative review.
                </p>
              </div>
              <div>
                <h1 className="font-semibold">2- Enter the Detail</h1>
                <p className="pl-4">
                  Provide the link to the Google Maps page with the negative
                  reviews and select no. of reviews to be deleted.
                </p>
              </div>
              <div>
                <h1 className="font-semibold">
                  3- Place order and wait until the review is deleted
                </h1>
                <p className="pl-4">
                  Once you&apos;ve placed an order, our team will work to have the
                  negative review removed.
                </p>
              </div>
            </div>
            <div className=" w-full md:w-[35%] relative">
              <OrderForm />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
