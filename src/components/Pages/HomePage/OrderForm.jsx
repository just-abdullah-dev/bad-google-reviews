"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function OrderForm() {
  const router = useRouter();
  const user = useSelector((state) => state.user)
  const [formData, setFormData] = useState({
    googleMapLink: "",
    noOfReviews: "1",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const validateForm = () => {
    let errors = {};
    const linkRegex = /https?:\/\/[^\s/$.?#].[^\s]*/;
    if (!linkRegex.test(formData.googleMapLink)) {
      errors.googleMapLink = "Enter valid google map link.";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Proceed with form submission
      setErrors({});
      const totalAmount = formData.noOfReviews * 25;
      console.log(user.balance,  totalAmount);
      if(user.balance >= totalAmount){
        // place order and navigate user to orders page 
        toast.success("Your order has been placed.")
        router.push('/orders')
      }else{
        toast("Topup first to place order.");

        router.push('/topup')
      }
      console.log("Form submitted", formData);
    } else {
      setErrors(validationErrors);
    }
  };
  return (
    <Card className="w-full bg-transparent">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-center font-bold">
          Charged only after deletion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className=" text-sm md:text-base">
          <div className="grid w-full items-center gap-4 mb-4">
            <Label htmlFor="googleMapLink">Google Map Link</Label>
            <Input
              
              type="text"
              className=" bg-white"
              id="googleMapLink"
              placeholder="Enter your Google Map Link"
              value={formData.googleMapLink}
              onChange={handleInputChange}
            />
            {errors.googleMapLink && (
              <p className="text-red-500 text-sm">{errors.googleMapLink}</p>
            )}
          </div>
          <div className="grid w-full items-center gap-4 mb-4">
            <Label htmlFor="noOfReviews">No Of Reviews</Label>
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
            {errors.noOfReviews && (
              <p className="text-red-500 text-sm">{errors.noOfReviews}</p>
            )}
          </div>

          <Button className="w-full" type="submit">
            Delete Reviews
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
