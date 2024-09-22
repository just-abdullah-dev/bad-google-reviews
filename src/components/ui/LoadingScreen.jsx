import React from "react";

export default function LoadingScreen() {
  return (
    <div className=" w-full h-screen bg-white grid place-items-center">
      <div className="loading-container">
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
      </div>
    </div>
  );
}
