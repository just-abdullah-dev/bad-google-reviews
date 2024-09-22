"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ArrowLeftCircle } from "lucide-react";
import ConfirmOrder from "./ConfirmOrder";
import { setUser } from "@/store/userSlice";
import { updateUserBalance } from "@/actions/balance/updateUserBalance";

export default function OrderForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [confirmOrder, setConfirmOrder] = useState(false);
  const [formData, setFormData] = useState({
    googleMapLink: "",
    noOfReviews: "1",
    reviewSelectionOpt: "", // To track user selection
    specificReviewLinks: "", // To store specific review links
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // Step control
  const [isLoading, setIsLoading] = useState(false);

  const totalAmount =
    formData.noOfReviews * process.env.NEXT_PUBLIC_PRICE_PER_REVIEW;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const validateLink = () => {
    let errors = {};
    const linkRegex = /https?:\/\/[^\s/$.?#].[^\s]*/;
    if (!linkRegex.test(formData.googleMapLink)) {
      errors.googleMapLink = "Enter a valid Google Map link.";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData?.reviewSelectionOpt) {
      if (
        formData?.reviewSelectionOpt === "specific" &&
        !formData?.specificReviewLinks
      ) {
        setErrors({
          specificReviewLinks:
            "Please paste the links of reviews to be deleted.",
        });
        return;
      }
      setErrors({});
      if (Number(user.balance) - Number(user.reservedAmount) >= totalAmount) {
        setConfirmOrder(true);
      } else {
        if (user.reservedAmount > 0) {
          alert(
            `Your €${
              user.reservedAmount
            } is already reserved for previous orders. You need to top up €${
              totalAmount - (Number(user.balance) - Number(user.reservedAmount))
            }`
          );
        }
        toast("Top up first to place order.");
        router.push("/topup");
      }
    } else {
      setErrors({ reviewSelectionOpt: "Select one option please." });
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    const validationErrors = validateLink();
    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      setStep(2);
    } else {
      setErrors(validationErrors);
    }
  };

  return confirmOrder ? (
    <ConfirmOrder
      isOpen={true}
      onClose={() => {
        setConfirmOrder(false);
      }}
      onConfirm={async () => {
        setIsLoading(true);
        const res = await fetch("/api/orders/user", {
          method: "POST",
          body: JSON.stringify({
            userId: user?.id,
            googleMapLink: formData?.googleMapLink,
            noOfReviews: formData?.noOfReviews,
            reviewSelectionOpt: formData?.reviewSelectionOpt,
            reviewLinks: formData?.specificReviewLinks,
            totalCost: totalAmount,
          }),
        });
        const data = await res.json();
        console.log(data);

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
        toast.success("Your order has been placed.");
        setIsLoading(false);
        router.push("/orders");
      }}
      data={formData}
    />
  ) : (
    <Card className="w-full bg-transparent border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-center font-bold relative">
          <ArrowLeftCircle
            onClick={() => {
              setStep(1);
            }}
            className={` ${
              step === 1 ? " hidden " : " block "
            } absolute top-1 cursor-pointer left-[-24px] lg:left-0`}
          />
          Charged only after deletion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="text-sm md:text-base">
          {/* Step 1: Google Map Link Input */}
          {step === 1 && (
            <div className="grid w-full items-center gap-4 mb-4">
              <Label htmlFor="googleMapLink">Google Map Link</Label>
              <Input
                type="text"
                className="bg-white"
                id="googleMapLink"
                placeholder="Enter your Google Map Link"
                value={formData.googleMapLink}
                onChange={handleInputChange}
              />
              {errors?.googleMapLink && (
                <p className="text-red-500 text-sm">{errors?.googleMapLink}</p>
              )}
              <Button onClick={handleNextStep} className="w-full">
                Proceed
              </Button>
            </div>
          )}

          {/* Step 2: Selection between Review Types */}
          {step === 2 && (
            <>
              {/* Selection Buttons */}
              <div className="grid w-full items-center gap-4 mb-4">
                {errors?.reviewSelectionOpt && (
                  <p className="text-red-500 text-sm">
                    {errors?.reviewSelectionOpt}
                  </p>
                )}
                <div className="flex flex-auto flex-wrap text-sm lg:text-base gap-2">
                  <Button
                    type="button"
                    className=" border border-black min-w-fit"
                    variant={
                      formData.reviewSelectionOpt === "1"
                        ? "default"
                        : "primary"
                    }
                    onClick={() =>
                      setFormData({ ...formData, reviewSelectionOpt: "1" })
                    }
                  >
                    Delete All 1 Star Reviews
                  </Button>
                  <Button
                    type="button"
                    className=" border border-black min-w-fit"
                    variant={
                      formData.reviewSelectionOpt === "1-2"
                        ? "default"
                        : "primary"
                    }
                    onClick={() =>
                      setFormData({ ...formData, reviewSelectionOpt: "1-2" })
                    }
                  >
                    Delete All 1-2 Star Reviews
                  </Button>
                  <Button
                    type="button"
                    className=" border border-black min-w-fit"
                    variant={
                      formData.reviewSelectionOpt === "1-3"
                        ? "default"
                        : "primary"
                    }
                    onClick={() =>
                      setFormData({ ...formData, reviewSelectionOpt: "1-3" })
                    }
                  >
                    Delete All 1-3 Star Reviews
                  </Button>
                  <Button
                    type="button"
                    className=" border border-black min-w-fit"
                    variant={
                      formData.reviewSelectionOpt === "specific"
                        ? "default"
                        : "primary"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        reviewSelectionOpt: "specific",
                      })
                    }
                  >
                    Specific Reviews
                  </Button>
                </div>
              </div>

              {/* Select Number of Reviews */}
              <div className="grid w-full items-center gap-4 mb-4">
                {formData?.reviewSelectionOpt !== "" && (
                  <Label htmlFor="noOfReviews">
                    No Of Reviews{" "}
                    <span className="text-gray-600">
                      (€ {process.env.NEXT_PUBLIC_PRICE_PER_REVIEW} per/review)
                    </span>
                  </Label>
                )}
                {formData?.reviewSelectionOpt === "specific" ? (
                  <select
                    id="noOfReviews"
                    className="bg-white border border-gray-300 rounded-md p-2"
                    value={formData.noOfReviews}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select number of reviews
                    </option>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                ) : formData?.reviewSelectionOpt !== "" ? (
                  <Input
                    id="noOfReviews"
                    className="bg-white border border-gray-300 rounded-md p-2"
                    value={formData.noOfReviews}
                    onChange={handleInputChange}
                    type="number"
                  />
                ) : null}
              </div>
              {/* Specific Review Links Textarea */}
              {formData.reviewSelectionOpt === "specific" && (
                <div className="grid w-full items-center gap-4 mb-4">
                  <div>
                    <Label htmlFor="specificReviewLinks">
                      Paste Review Links
                    </Label>
                    {errors?.specificReviewLinks && (
                      <p className="text-red-500 text-sm">
                        {errors?.specificReviewLinks}
                      </p>
                    )}
                  </div>
                  <textarea
                    id="specificReviewLinks"
                    className="bg-white border border-gray-300 rounded-md p-2"
                    placeholder="Enter review links separated by commas"
                    value={formData.specificReviewLinks}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              {/* Delete Reviews Button */}
              <Button disabled={isLoading} className="w-full" onClick={handleSubmit}>
                {isLoading ? "Please wait..." : "Delete Reviews"}
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
