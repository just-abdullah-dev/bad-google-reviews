import React from "react";
import Layout from "../../Layout/Layout";
import OrderForm from "./OrderForm";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const trans = useTranslations("HomePage");
  return (
    <Layout>
      <div className="grid place-items-center gap-4 md:gap-16 py-4 px-8 min-h-[calc(100vh-64px)]">
        <h1 className=" text-[40px] sm:text-6xl md:text-8xl font-[600] tracking-tighter leading-tight text-center">
          {trans("title1")} <span className="text-[#4286f5]">S</span>
          <span className="text-[#dc4437]">i</span>
          <span className="text-[#f5b400]">m</span>
          <span className="text-[#4286f5]">p</span>
          <span className="text-[#109d58]">l</span>
          <span className="text-[#dc4437]">e</span> {trans("title2")}
        </h1>
        <div className="w-full h-full">
          <div className="flex flex-col md:flex-row md:gap-6 ">
            <div className=" w-full md:w-[65%] text-base md:text-lg space-y-4 md:border-r-2 border-black">
              <div>
                <h1 className="font-semibold">1- {trans("step1Heading")}</h1>
                <p className="pl-4">
                  {trans("step1Desc")}
                </p>
              </div>
              <div>
                <h1 className="font-semibold">2- {trans("step2Heading")}</h1>
                <p className="pl-4">
                  {trans("step2Desc")}
                </p>
              </div>
              <div>
                <h1 className="font-semibold">3- {trans("step3Heading")}</h1>
                <p className="pl-4">
                  {trans("step3Desc")}
                </p>
              </div>
            </div>
            <div className=" w-full md:w-[35%] relative">
              <OrderForm trans={trans} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
