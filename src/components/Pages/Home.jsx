"use client";
import React, { useState, useEffect } from "react";
import LandingPage from "./LandingPage/LandingPage";
import HomePage from "./HomePage/HomePage";
import { useSelector } from "react-redux";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user.id) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return isLoggedIn ? (
    <HomePage />
  ) : (
    <LandingPage />
  );
}
