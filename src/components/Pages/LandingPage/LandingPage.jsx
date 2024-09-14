"use client";
import React, { useState } from "react";
import GradientBG from "./GradientBG";
import { Button } from "../../ui/button";
import Link from "next/link";
import Auth from "../../Auth/Auth";
import Image from "next/image";

export default function LandingPage() {
  const [isInterested, setIsInterested] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <div className="h-screen relative overflow-hidden">
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
          className={` w-full h-full absolute top-0 left-0 opacity-0 z-[2]`}
        ></div>
        <Auth
          closeModal={() => {
            setIsInterested(false);
          }}
        />
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
        <div className="grid gap-4 mx-auto px-4">
          <div className="flex items-center justify-center w-full relative">
            {!imageLoaded && (
              <div className="w-[200px] h-[200px] absolute bottom-0 rounded-xl bg-gray-200 animate-pulse"></div>
            )}
            <Image
              width={200}
              height={200}
              src="/hand-icon.png"
              alt="hand icon"
              className={`transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </div>
          <h1 className=" text-[40px] sm:text-6xl md:text-8xl font-[600] tracking-tighter leading-tight text-center">
            Bad <span className="text-[#4286f5]">G</span>
            <span className="text-[#dc4437]">o</span>
            <span className="text-[#f5b400]">o</span>
            <span className="text-[#4286f5]">g</span>
            <span className="text-[#109d58]">l</span>
            <span className="text-[#dc4437]">e</span> Review?
          </h1>
          <p className=" text-sm md:text-base text-center font-[500]">
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
