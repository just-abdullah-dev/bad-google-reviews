"use client";
import React, { useState, useEffect } from "react";
import LandingPage from "./LandingPage/LandingPage";
import HomePage from "./HomePage/HomePage";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/userSlice";
import LoadingScreen from "../ui/LoadingScreen";
import { getUserWithBalance } from "@/actions/balance/getUserWithBalance";
import OrderPage from "./OrderPage/OrderPage";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const main = async () => {
      setIsLoading(true);
      try {
        const data = await getUserWithBalance();
        dispatch(setUser(data));
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        console.log("not logged in");
      }
      setIsLoading(false);
    };
    if (!user.id) {
      main();
    } else {
      setIsLoading(false);
      setIsLoggedIn(true);
    }
  }, []);
  if (isLoading) {
    return <LoadingScreen />;
  }
  return isLoggedIn ? (
    user.isAdmin ? (
      <OrderPage isAdmin={true} />
    ) : (
      <HomePage />
    )
  ) : (
    <LandingPage />
  );
}
