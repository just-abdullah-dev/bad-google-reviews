import LoadingScreen from "@/components/ui/LoadingScreen";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import DisplayOrderDetails from "./DisplayOrderDetails";
import toast from "react-hot-toast";

const AdminOrders = ({ trans }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const main = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
          headers: {
            "Cache-Control": "no-store",
          },
          next: {
            revalidate: 0,
            tags: ["all_orders"],
          },
        };
        const res = await fetch(`/api/orders/admin`, requestOptions);
        const data = await res.json();
        setOrders(data?.data?.documents);
        setIsError("");
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsError(error.message);
      }
    };
    main();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  } else if (isError) {
    return (
      <div className="w-full h-full grid place-items-center">
        <p className="text-red-600">{isError}</p>
      </div>
    );
  } else if (orders.length <= 0) {
    return (
      <div className="w-full h-full grid place-items-center">
        <p className="text-red-600">{trans("errorMsg")}</p>
      </div>
    );
  }
  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd hh:mm a");
  };

  return selectedOrder !== null ? (
    <DisplayOrderDetails
      order={selectedOrder}
      isOpen={true}
      onClose={() => {
        setSelectedOrder(null);
      }}
      onUpdate={() => {
        toast.success("Order has been updated successfully.");
        setSelectedOrder(null);
        window.location.reload();
      }}
    />
  ) : (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent">
          <thead>
            <tr className="bg-gray-100 text-left border-b border-gray-400">
              <th className="py-3 px-4 font-semibold text-[12px] md:text-sm text-gray-700">
                {trans("th0")}
              </th>
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
                {trans("th5")}
              </th>
              <th className="py-3 px-4 font-semibold text-[12px] md:text-sm text-gray-700">
                {trans("th6")}
              </th>
              <th className="py-3 px-4 font-semibold text-[12px] md:text-sm text-gray-700">
                {trans("th7")}
              </th>
              <th className="py-3 px-4 font-semibold text-[12px] md:text-sm text-gray-700">
                {trans("th8")}
              </th>
            </tr>
          </thead>
          <tbody>
            {[...orders].reverse().map((order, index) => (
              <tr
                key={index}
                className={`${
                  order.status === "fulfilled"
                    ? " bg-green-200 "
                    : order.status === "partially-fulfilled"
                    ? " bg-green-100 "
                    : order.status === "unfulfilled"
                    ? " bg-red-200 "
                    : "hover:bg-gray-300 hover:bg-opacity-45 "
                } border-b border-gray-300   duration-300`}
                
              >
                <td className="py-3 px-4 text-gray-800 text-[12px] md:text-sm">
                  {formatDate(order?.$createdAt)}
                </td>
                <td className="py-3 px-4 text-gray-800 text-[12px] md:text-sm">
                  {order?.user?.name}<br/>(
                  <a
                    target="_blank" className="text-blue-500" href={`mailto:${order?.user?.email}`}>
                    {order?.user?.email}
                  </a>
                  )
                </td>
                <td className="py-3 px-4 text-gray-800 text-[12px] md:text-sm">
                  {order.$id}
                </td>
                <td className="py-3 px-4 text-gray-800 text-[12px] md:text-sm">
                  {order.noOfReviews}
                </td>

                <td className="py-3 px-4 text-gray-800 text-[12px] md:text-sm">
                  {order.status
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </td>

                <td className="py-3 px-4 text-gray-800 text-[12px] md:text-sm">
                  {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL} {order.totalCost}
                </td>
                <td className="py-3 px-4 text-gray-800 text-[12px] md:text-sm">
                  {order.finalCost !== null
                    ? `${process.env.NEXT_PUBLIC_CURRENCY_SYMBOL} ${order.finalCost}`
                    : "N/A"}
                </td>
                <td className="py-3 px-4 text-gray-800 text-[12px] md:text-sm">
                  <p
                  onClick={() => {
                    setSelectedOrder(order);
                  }}
                  className=" text-blue-500 cursor-pointer hover:underline"
                  >Details</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
