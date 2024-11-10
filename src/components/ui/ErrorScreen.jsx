import React from "react";
import { Button } from "./button";
import Link from "next/link";

export default function ErrorScreen({ title = "Error", message = "" }) {
  return (
    <div className=" w-full h-screen bg-white grid place-items-center">
      <div>
        <h1 className=" text-red-500 font-semibold text-4xl md:text-6xl">{title}</h1>
        
      {message && <p className=" text-center text-base  font-semibold mt-6">{message}</p>}
    <div className="w-full grid place-items-center">
    <Link href="/">
    <Button className="mt-6 ">
      Go Back to Home Page
    </Button></Link>
    </div>
      </div>
    </div>
  );
}
