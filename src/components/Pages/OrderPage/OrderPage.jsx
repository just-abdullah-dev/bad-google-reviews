"use client";
import Layout from "@/components/Layout/Layout";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import UserOrders from "./UserOrders";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import AdminOrders from "./AdminOrders";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getUserWithBalance } from "@/actions/balance/getUserWithBalance";
import { setUser } from "@/store/userSlice";
import { useTranslations } from "next-intl";
import { redirect } from "@/i18n/routing";

export default function OrderPage({ isAdmin = false }) {
  const trans = useTranslations("OrdersPage");

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const main = async () => {
      setIsLoading(true);
      try {
        const data = await getUserWithBalance();
        dispatch(setUser(data));
        console.log(data);

        if (data?.isAdmin) {
          redirect("/");
        }
      } catch (error) {
        toast.error("Kindly login first!");
        redirect("/");
      }
      setIsLoading(false);
    };
    if (!user.id) {
      main();
    } else {
      if (user?.isAdmin && !isAdmin) {
        redirect("/");
      } else {
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
              {trans("title")}
            </h1>
            <Input
              placeholder="Search..."
              className="hidden w-[300px] outline-gray-300 outline outline-1"
              type="text"
            />
          </div>
          {isAdmin ? (
            <AdminOrders trans={trans} />
          ) : (
            <UserOrders trans={trans} userId={user?.id} />
          )}
        </div>
      </div>
    </Layout>
  );
}
