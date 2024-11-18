"use client";
import React, { useState } from "react";
import GradientBG from "./GradientBG";
import { Button } from "../../ui/button";
import Auth from "../../Auth/Auth";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LangSwitch from "@/components/Layout/Header/LangSwitch";

export default function LandingPage() {
  const [isInterested, setIsInterested] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const trans = useTranslations("LandingPage");

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
        <div className=" absolute top-0 left-0 py-4 px-4 md:px-24 flex items-center justify-between w-full">
          <Link href={"/"} className=" text-lg font-semibold">
            25 Euro Löschung
          </Link>
          <LangSwitch />
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
            {trans("title1")} <span className="text-[#4286f5]">G</span>
            <span className="text-[#dc4437]">o</span>
            <span className="text-[#f5b400]">o</span>
            <span className="text-[#4286f5]">g</span>
            <span className="text-[#109d58]">l</span>
            <span className="text-[#dc4437]">e</span> {trans("title2")}
          </h1>
          <p className=" text-sm md:text-base text-center font-[500]">
            {trans("p1")}
            <br />
            {trans("p2")}
          </p>
          <div className=" flex items-center justify-center w-full ">
            <Button
              onClick={() => {
                setIsInterested(!isInterested);
              }}
              className={""}
            >
              {trans("actionBtn")}
            </Button>
          </div>
        </div>
        <GradientBG className={" absolute bottom-0 left-0 z-[-1] "} />
      </div>
    </div>
  );
}
