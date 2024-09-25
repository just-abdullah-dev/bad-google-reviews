"use client";
import Layout from "@/components/Layout/Layout";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import UserOrders from "./UserOrders";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AdminOrders from "./AdminOrders";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getUserWithBalance } from "@/actions/balance/getUserWithBalance";
import { setUser } from "@/store/userSlice";

export default function OrderPage({ isAdmin = false }) {
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const main = async () => {
      setIsLoading(true);
      try {
        const data = await getUserWithBalance();
        dispatch(setUser(data));
        if (data?.isAdmin) {
          router.push("/");
        }
      } catch (error) {
        toast.error("Kindly login first!");
        router.push("/");
      }
      setIsLoading(false);
    };
    if (!user.id) {
      main();
    } else {
      if (user?.isAdmin && !isAdmin) {
        router.push("/");
      }else{
        setIsLoading(false);
      }
    }
  }, []);
  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <Layout>
      <div className=" min-h-[calc(100vh-64px)] flex flex-col items-center">
        <div className=" w-full py-6 lg:w-[95%] xl:w-[90%] 2xl:w-[85%]">
          <div className=" flex flex-col md:flex-row md:items-center gap-4 justify-between px-4 md:p-0">
            <h1 className="font-semibold text-3xl md:text-4xl">
              Orders History
            </h1>
            <Input
              placeholder="Search..."
              className="hidden w-[300px] outline-gray-300 outline outline-1"
              type="text"
            />
          </div>
          {isAdmin ? <AdminOrders /> : <UserOrders userId={user?.id} />}
        </div>
      </div>
    </Layout>
  );
}
