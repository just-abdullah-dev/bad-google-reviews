import LoadingScreen from "@/components/ui/LoadingScreen";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import DisplayOrderDetails from "./DisplayOrderDetails";
import toast from "react-hot-toast";

const AdminOrders = () => {


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
          next: { tags: ["all_orders"] },
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
        <p className="text-red-600">No order history found.</p>
      </div>
    );
  }
  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd hh:mm a");
  };
  const handleStatusChange = (index, newStatus) => {
    const updatedOrders = [...orders];
    updatedOrders[index].currentStatus = newStatus;

    // If partially fulfilled, prompt for number of reviews fulfilled
    if (newStatus === "partially fulfilled") {
      const fulfilledReviews = prompt("Enter the number of reviews fulfilled:");
      if (fulfilledReviews) {
        const finalCost = fulfilledReviews * 25; // {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}25 per review
        updatedOrders[index].finalCost = finalCost;
      }
    } else if (newStatus === "fulfilled") {
      // If fully fulfilled, set final cost equal to total cost
      updatedOrders[index].finalCost = updatedOrders[index].totalCost;
    } else {
      updatedOrders[index].finalCost = null;
    }

    setOrders(updatedOrders);
  };


  return (
    selectedOrder !== null ?
    <DisplayOrderDetails 
    order={selectedOrder}
    isOpen={true}
    onClose={()=>{
      setSelectedOrder(null);
    }}
    onUpdate={()=>{
      toast.success("Order has been updated successfully.");
      setSelectedOrder(null);
      window.location.reload();
    }}
    /> :
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent">
          <thead>
            <tr className="bg-gray-100 text-left border-b border-gray-400">
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Date/Time
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Order ID
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                No of Reviews
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Status
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Total Cost
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Final Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={index}
                className={`${order.status === "fulfilled" ? " bg-green-200 " : order.status === "unfulfilled" ? " bg-red-200 " : "hover:bg-gray-300 hover:bg-opacity-45 "} border-b border-gray-300   duration-300 cursor-pointer`}
                onClick={() => {
                  setSelectedOrder(order);
                }}
              >
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {formatDate(order?.$createdAt)}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">{order.$id}</td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {order.noOfReviews}
                </td>

                <td className="py-3 px-4 text-gray-800 text-sm">
                  {order.status
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </td>

                <td className="py-3 px-4 text-gray-800 text-sm">
                  {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL} {order.totalCost}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {order.finalCost !== null
                    ? `${process.env.NEXT_PUBLIC_CURRENCY_SYMBOL} ${order.finalCost}`
                    : "N/A"}
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
