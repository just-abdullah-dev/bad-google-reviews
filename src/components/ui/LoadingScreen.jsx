import React from "react";

export default function LoadingScreen({ message = "" }) {
  return (
    <div className=" w-full h-screen bg-white grid place-items-center">
      {message && <p className=" text-center text-xl font-semibold">{message}</p>}
      <div className="loading-container">
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
      </div>
    </div>
  );
}
