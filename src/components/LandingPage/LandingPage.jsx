"use client";
import React, { useState } from "react";
import GradientBG from "./GradientBG";
import { Button } from "../ui/button";
import Link from "next/link";
import Auth from "../Auth/Auth";

export default function LandingPage() {
  const [isInterested, setIsInterested] = useState(false);
  return (
    <div className="h-screen relative">
      <div
        className={`${
          isInterested
            ? " bg-opacity-50 pointer-events-auto opacity-100 "
            : " bg-opacity-0 pointer-events-none opacity-0 "
        } bg-black duration-700 transition-all absolute top-0 left-0 w-full h-full z-[1] grid place-items-center`}
      >
        <div
          onClick={() => {
            setIsInterested(!isInterested);
          }}
          className={` bg-green-500 w-full h-full absolute top-0 left-0 opacity-0 z-[2]`}
        >
          
        </div>
        <Auth closeModal={()=>{
            setIsInterested(false)
        }} />
      </div>
      <div
        className={
          " h-full w-full overflow-hidden relative grid place-items-center"
        }
      >
        <div className=" absolute top-0 left-0 py-4 px-8">
          <Link href={"/"} className=" text-lg font-semibold">
            Brand Name
          </Link>
        </div>
        <div className="grid gap-4">
          <h1 className=" text-8xl font-[600] tracking-tighter">
            Bad <span class="text-[#4286f5]">G</span>
            <span class="text-[#dc4437]">o</span>
            <span class="text-[#f5b400]">o</span>
            <span class="text-[#4286f5]">g</span>
            <span class="text-[#109d58]">l</span>
            <span class="text-[#dc4437]">e</span> Review?
          </h1>
          <p className=" text-center font-[500]">
            Not anymore!
            <br />
            We use our expertise to get your bad reviews removed, so you can
            develop trust among your customers
          </p>
          <div className=" flex items-center justify-center w-full ">
            <Button
              onClick={() => {
                setIsInterested(!isInterested);
              }}
              className={""}
            >
              I&apos;m interested!
            </Button>
          </div>
        </div>
        <GradientBG className={" absolute bottom-0 left-0 z-[-1] "} />
      </div>
    </div>
  );
}
