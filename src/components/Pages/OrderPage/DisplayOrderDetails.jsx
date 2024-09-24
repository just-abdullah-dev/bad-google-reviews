"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deductUserBalance } from "@/actions/balance/deductUserBalance";
import { revalidateTagFunc } from "@/services/util";

export default function DisplayOrderDetails({
  isOpen,
  onClose,
  onUpdate,
  order,
}) {
  // Array of possible statuses
  const statuses = [
    "pending",
    "submitted-to-google",
    "unfulfilled",
    "partially-fulfilled",
    "fulfilled",
    // "cancel",
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [deletedNoOfReviews, setDeletedNoOfReviews] = useState(1);
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders/admin", {
        method: "PUT",
        body: JSON.stringify({
          orderId: order?.$id,
          status,
          deletedNoOfReviews:
            status === "fulfilled" ? order.noOfReviews : deletedNoOfReviews,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        if (status === "fulfilled" || status === "partially-fulfilled") {
          const reviews =
            status === "fulfilled"
              ? order.noOfReviews
              : status === "partially-fulfilled"
              ? deletedNoOfReviews
              : 0;
          await deductUserBalance(
            order?.userId,
            `${process.env.NEXT_PUBLIC_PRICE_PER_REVIEW * Number(reviews)}`
          );
        }else if (status === "unfulfilled") {
          await deductUserBalance(
            order?.userId,
            `${order.totalCost}`,
            "yes"
          );
        }
        setOpen(false);
        onUpdate();
      } else {
        setIsError(data.message);
      }
      revalidateTagFunc("all_orders")
    } catch (error) {
      console.error(error);
      setIsError(error.message);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] grid place-items-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Order Details
          </DialogTitle>
          <DialogDescription>
            {isError && 
            <span className=" text-red-500">{isError}</span>}
          </DialogDescription>
        </DialogHeader>
        <div className=" w-full md:w-[400px] text-sm ">
          <div className=" grid gap-3">
            <p className=" font-medium">
              Order ID: <span className="text-black">{order?.$id}</span>
            </p>
            <p className=" font-medium ">
              Google Map Link:{" "}
              <span className="text-blue-500">
                <a
                  href={order.googleMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {order.googleMapLink}
                </a>
              </span>
            </p>
            <p className=" font-medium">
              No Of Reviews:{" "}
              <span className="text-black">{order?.noOfReviews}</span>
            </p>

            <p className=" font-medium">
              Total Cost:{" "}
              <span className="text-black">
                {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL} {order.totalCost}
              </span>
            </p>
            <p className=" font-medium">
              Final Cost:{" "}
              <span className="text-black">
                {order.finalCost !== null
                  ? `${process.env.NEXT_PUBLIC_CURRENCY_SYMBOL} ${
                      status === "partially-fulfilled"
                        ? process.env.NEXT_PUBLIC_PRICE_PER_REVIEW *
                          deletedNoOfReviews
                        : status === "fulfilled"
                        ? order.totalCost
                        : order.finalCost
                    }`
                  : "N/A"}
              </span>
            </p>
            {order?.reviewSelectionOpt === "specific" ? (
              <p className=" font-medium">
                Reviews Links:{" "}
                <span className="text-black">{order?.reviewLinks}</span>
              </p>
            ) : (
              <Button
                type="button"
                className=" border border-black w-[65%]"
                variant={"default"}
              >
                Delete All {order?.reviewSelectionOpt} Star Reviews
              </Button>
            )}
            <td className=" font-medium text-black">
              Current Status:{" "}
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                className="bg-gray-200 border rounded pl-3 py-1"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </option>
                ))}
              </select>
            </td>
            {/* Select Number of Reviews */}
            <div className="grid w-full items-center gap-4">
              {status === "partially-fulfilled" && (
                <>
                  {isError && <p className="text-sm text-red-500">{isError}</p>}
                  <select
                    id="deletedNoOfReviews"
                    className="bg-white border border-gray-300 rounded-md p-2"
                    value={deletedNoOfReviews}
                    onChange={(e) => {
                      setDeletedNoOfReviews(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Select number of deleted reviews
                    </option>
                    {Array.from(
                      { length: order.noOfReviews },
                      (_, i) => i + 1
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex w-full md:w-[400px] justify-between items-center">
          <Button disabled={isLoading} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            className=" bg-blue-600 hover:bg-blue-500"
            onClick={handleUpdate}
          >
            {isLoading ? "Please wait..." : "Update"}
          </Button>
        </div>
      </DialogContent>
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          aria-hidden="true"
        />
      )}
    </Dialog>
  );
}
