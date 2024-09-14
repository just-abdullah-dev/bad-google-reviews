import React from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import GradientBG from "../Pages/LandingPage/GradientBG";

export default function Layout({ children }) {
  return (
    <div className="overflow-hidden relative w-full h-full">
      <Header />
      <div className=" mb-[64px]" />
      <div className=" container mx-auto">{children}</div>
      <GradientBG className={" absolute bottom-0 left-0 z-[-1] "} />
      {/* <Footer /> */}
    </div>
  );
}
