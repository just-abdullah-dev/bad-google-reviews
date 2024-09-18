"use client";
import Layout from "@/components/Layout/Layout";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import UserOrders from "./UserOrders";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import AdminOrders from "./AdminOrders";

export default function OrderPage() {
  const user = useSelector((state) => state.user);
  const router = useRouter();
  useEffect(() => {
    if (!user.id) {
      toast.error("Kindly login first.");
      router.push("/");
    }
  }, []);
  const [currentViewOrders, setCurrentViewOrders] = useState("user");
  return (
    <Layout>
      <div className=" min-h-[calc(100vh-64px)] grid place-items-center">
        <div className=" w-full lg:w-[95%] xl:w-[90%] 2xl:w-[85%]">
          <div className=" flex flex-col md:flex-row md:items-center gap-4 justify-between px-4 md:p-0">
            <h1 className="font-semibold text-3xl md:text-4xl">
              Orders History
            </h1>
            <Input
              placeholder="Search..."
              className="w-[300px] outline-gray-300 outline outline-1"
              type="text"
            />
          </div>
          <div className=" flex items-center justify-around max-w-[700px] mx-auto my-4">
            <Button
              variant={"default"}
              disabled={currentViewOrders === "user"}
              onClick={() => {
                setCurrentViewOrders("user");
              }}
            >
              User Orders
            </Button>
            <Button
              variant={"default"}
              disabled={currentViewOrders === "admin"}
              onClick={() => {
                setCurrentViewOrders("admin");
              }}
            >
              Admin Dashboard
            </Button>
          </div>
          {currentViewOrders === "user" ? <UserOrders /> : <AdminOrders />}
        </div>
      </div>
    </Layout>
  );
}
