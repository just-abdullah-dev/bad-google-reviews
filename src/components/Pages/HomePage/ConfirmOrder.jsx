"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { updateUserBalance } from "@/actions/balance/updateUserBalance";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/userSlice";

export default function ConfirmOrder({ isOpen, onClose, onConfirm, data }) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [open, setOpen] = useState(isOpen);
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const totalAmount =
    data.noOfReviews * process.env.NEXT_PUBLIC_PRICE_PER_REVIEW;

  const handleConfirm = async () => {
    setIsLoading(true);
    const res = await fetch("/api/orders/user", {
      method: "POST",
      body: JSON.stringify({
        userId: user?.id,
        googleMapLink: data?.googleMapLink,
        noOfReviews: data?.noOfReviews,
        reviewSelectionOpt: data?.reviewSelectionOpt,
        reviewLinks: data?.specificReviewLinks,
        totalCost: totalAmount,
      }),
    });
    console.log(await res.json());

    dispatch(
      setUser({
        ...user,
        reservedAmount: Number(user.reservedAmount) + Number(totalAmount),
      })
    );
    await updateUserBalance(
      user?.id,
      ``,
      `${Number(user.reservedAmount) + Number(totalAmount)}`
    );

    setIsLoading(false);

    setOpen(false);
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] grid place-items-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Confirm Order
          </DialogTitle>
        </DialogHeader>
        <div className=" w-full md:w-[400px] text-sm ">
          <div className=" grid gap-3">
            <ShoppingBag className="w-14 h-14 mx-auto text-blue-600" />
            <p className=" font-medium ">
              Google Map Link:{" "}
              <span className="text-black">{data?.googleMapLink}</span>
            </p>

            {data?.reviewSelectionOpt === "specific" ? (
              <p className=" font-medium">
                Specific Reviews Links:{" "}
                <span className="text-black">{data?.specificReviewLinks}</span>
              </p>
            ) : (
              <Button
                type="button"
                className=" border border-black w-[65%]"
                variant={"default"}
              >
                Delete All {data?.reviewSelectionOpt} Star Reviews
              </Button>
            )}
            <p className=" font-medium">
              No Of Reviews:{" "}
              <span className="text-black">{data?.noOfReviews}</span>
            </p>

            <p className=" font-medium">
              Total Amount:{" "}
              <span className="text-black">
                {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{" "}
                {totalAmount.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-6 flex w-full md:w-[400px] justify-between items-center">
          <Button disabled={isLoading} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            className=" bg-blue-600 hover:bg-blue-500"
            onClick={handleConfirm}
          >
            {isLoading ? "Please wait..." : "Confirm"}
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
