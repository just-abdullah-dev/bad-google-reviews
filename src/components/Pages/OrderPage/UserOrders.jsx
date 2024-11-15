import LoadingScreen from "@/components/ui/LoadingScreen";
import { format } from "date-fns";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const UserOrders = ({ userId, trans }) => {
  const [userOrders, setUserOrders] = useState("loading");
  useEffect(() => {
    const main = async () => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
        next: { tags: ["user_orders"] },
      };
      const res = await fetch(
        `/api/orders/user?userId=${userId}`,
        requestOptions
      );
      const data = await res.json();
      setUserOrders(data);
    };
    if (userOrders === "loading") {
      main();
    }
  }, []);

  if (userId === "") {
    return;
  }

  if (userOrders === "loading") {
    return <LoadingScreen />;
  } else if (userOrders?.data?.total == 0) {
    return (
      <div className="w-full h-full grid place-items-center">
        <p className="text-red-600">{trans("errorMsg")}</p>
      </div>
    );
  }
  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd hh:mm a");
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent">
          <thead>
            <tr className="bg-gray-100 text-left border-b border-gray-400">
              <th className="py-3 px-4 font-semibold text-[12px] md:text-sm text-gray-700">
                {trans("th1")}
              </th>
              <th className="py-3 px-4 font-semibold text-[12px] md:text-sm text-gray-700">
                {trans("th2")}
              </th>
              <th className="py-3 px-4 font-semibold text-[12px] md:text-sm text-gray-700">
                {trans("th3")}
              </th>
              <th className="py-3 px-4 font-semibold text-[12px] md:text-sm text-gray-700">
                {trans("th4")}
              </th>
              <th className="py-3 px-4 font-semibold text-[12px] md:text-sm text-gray-700">
                {trans("th5")}
              </th>
              <th className="py-3 px-4 font-semibold text-[12px] md:text-sm text-gray-700">
                {trans("th6")}
              </th>
              <th className="py-3 px-4 font-semibold text-[12px] md:text-sm text-gray-700">
                {trans("th7")}
              </th>
            </tr>
          </thead>
          <tbody>
            {[...userOrders?.data?.documents].reverse().map((item, index) => (
              <tr
                key={index}
                className={`${
                  item.status === "fulfilled"
                    ? " bg-green-200 "
                    : item.status === "partially-fulfilled"
                    ? " bg-green-100 "
                    : item.status === "unfulfilled"
                    ? " bg-red-200 "
                    : "hover:bg-gray-300 hover:bg-opacity-45 "
                } border-b border-gray-300   duration-300 `}
              >
                <td className="py-3 px-4 text-gray-800 text-[12px] md:text-sm">
                  {formatDate(item?.$createdAt)}
                </td>
                <td className="py-3 px-4 text-gray-800 text-[12px] md:text-sm">
                  {item.$id}
                </td>
                <td className="py-3 px-4 text-gray-800 text-[12px] md:text-sm">
                  {item?.noOfReviews}
                </td>
                <td className="py-3 px-4 text-blue-500 text-[12px] md:text-sm">
                  <Link
                    href={item?.googleMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Google Map Link
                  </Link>
                </td>
                <td className="py-3 px-4 text-gray-800 text-[12px] md:text-sm">
                  {item?.status
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                  {item?.status === "partially-fulfilled"
                    ? ` (${item?.deletedNoOfReviews})`
                    : ""}
                </td>
                <td className="py-3 px-4 text-gray-800 text-[12px] md:text-sm">
                  {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL} {item?.totalCost}
                </td>
                <td className="py-3 px-4 text-gray-800 text-[12px] md:text-sm">
                  {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL} {item?.finalCost}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserOrders;
