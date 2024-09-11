import React from "react";
import GradientBG from "./GradientBG";

export default function LandingPage() {
  return (
    <div
      className={
        " h-screen w-full overflow-hidden relative grid place-items-center"
      }
    >
      <div>
        <h1>Bad Google Review?</h1>
      </div>
      <GradientBG className={" absolute bottom-0 left-0 z-[-1] "} />
    </div>
  );
}
