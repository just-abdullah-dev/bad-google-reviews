"use client";
import ErrorScreen from "@/components/ui/ErrorScreen";
import React from "react";

export default function page({ searchParams }) {
  if (searchParams?.type !== "google") {
    window.location.href = "/";
    return;
  }
  return (
    <ErrorScreen
      title="Signup with Google Failed"
      message="Something went wrong during signup. Please try again or contact support if the issue persists."
    />
  );
}
