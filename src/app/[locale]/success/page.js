"use client";
import { getUserWithBalance } from "@/actions/balance/getUserWithBalance";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { account } from "@/lib/app_write_client";
import { setUser } from "@/store/userSlice";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    const main = async () => {
      try {
        const user = await account.get();
        console.log(user);

        const res = await fetch("/api/balance", {
          method: "POST",
          body: JSON.stringify({
            userId: user?.$id,
          }),
        });
        if (res.status !== 409) {
          const balanceData = await res.json();
          if (!balanceData?.success) {
            toast.error(balanceData?.message);
            return;
          }
        }

        const data = await getUserWithBalance();
        console.log("with balance: ", user);

        dispatch(setUser(data));
        toast.success("Successfully Logged in.");
        window.location.href = "/";
      } catch (error) {
        console.log(error);
        toast.error(error?.message);
      }
    };
    main();
  }, []);
  return <LoadingScreen />;
}
