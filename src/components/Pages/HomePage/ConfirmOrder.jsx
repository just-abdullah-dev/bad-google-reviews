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
import { revalidateTagFunc } from "@/services/util";
import { useLocale, useTranslations } from "next-intl";

export default function ConfirmOrder({ isOpen, onClose, onConfirm, data }) {
  const trans = useTranslations("ComfirmOrder");
  const locale = useLocale();

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
        locale
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
    revalidateTagFunc("user_orders");
    revalidateTagFunc("all_orders");
    setIsLoading(false);

    setOpen(false);
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] grid place-items-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {trans("title")}
          </DialogTitle>
        </DialogHeader>
        <div className=" w-full md:w-[400px] text-sm ">
          <div className=" grid gap-3">
            <ShoppingBag className="w-14 h-14 mx-auto text-blue-600" />
            <p className=" font-medium ">
            {trans("p1")}:{" "}
              <span className="text-black">{data?.googleMapLink}</span>
            </p>

            {data?.reviewSelectionOpt === "specific" ? (
              <p className=" font-medium">
                {trans("p2")}:{" "}
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
            {trans("p3")}:{" "}
              <span className="text-black">{data?.noOfReviews}</span>
            </p>

            <p className=" font-medium">
            {trans("p4")}:{" "}
              <span className="text-black">
                {process.env.NEXT_PUBLIC_CURRENCY_SYMBOL}{" "}
                {totalAmount.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-6 flex w-full md:w-[400px] justify-between items-center">
          <Button disabled={isLoading} onClick={handleClose}>
          {trans("cancelBtn")}
          </Button>
          <Button
            disabled={isLoading}
            className=" bg-blue-600 hover:bg-blue-500"
            onClick={handleConfirm}
          >
            {isLoading ? trans("btnLoading") : trans("confirmBtn")}
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
