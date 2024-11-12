"use client";
import { usePathname, useRouter } from "@/i18n/routing";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import React, { useState } from "react";

export default function LangSwitch() {
  //   const [currentLocale, setCurrentLocale] = useState("en");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const toggleLocale = currentLocale === "en" ? "de" : "en";
  const switchLanguage = () => {
    router.replace(
      {
        pathname: pathname,
      },
      { locale: toggleLocale }
    );
  };
  return (
    <div className=" ">
      <div className="flex items-center gap-2 cursor-pointer relative w-full group">
        <div
          className=" flex items-center gap-1 cursor-pointer font-medium duration-300 transition-all"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {currentLocale === "en"
            ? "English en"
            : currentLocale === "de"
            ? "German de"
            : ""}{" "}
          <ChevronDown
            className={` ${
              isOpen ? " top-[3px]" : "top-0"
            } duration-300 transition-all relative `}
          />
        </div>
        <div className=" group-hover:opacity-100 opacity-0 duration-500 transition-all bg-white rounded-xl overflow-hidden absolute top-[40px] left-0">
          <p
            onClick={switchLanguage}
            // onClick={() => {
            //   setCurrentLocale(currentLocale === "en" ? "de" : "en");
            // }}
            className=" py-2 px-2 hover:bg-gray-200 duration-300 transition-all cursor-pointer"
          >
            {currentLocale === "en"
              ? "German de"
              : currentLocale === "de"
              ? "English en"
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
