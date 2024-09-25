"use client";
import { account, ID } from "@/lib/app_write_client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { getUserWithBalance } from "@/actions/balance/getUserWithBalance";

export default function Auth({ closeModal }) {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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
    if (!formData.email) {
      errors.email = "Email is required.";
    }
    if (!formData.password) {
      errors.password = "Password is required.";
    }
    if (!isLogin && !formData.name) {
      errors.name = "Name is required for signup.";
    }
    return errors;
  };

  const login = async () => {
    setIsLoading(true);
    try {
      await account.createEmailPasswordSession(
        formData?.email,
        formData?.password
      );
      setErrors({});
      const data = await getUserWithBalance();
      dispatch(setUser(data));
      toast.success("Successfully Logged in.");
      window.location.reload();
    } catch (error) {
      console.log(error);
      setErrors({
        general: error?.message,
      });
    }
    setIsLoading(false);
  };

  const register = async () => {
    setIsLoading(true);
    try {
      const data = await account.create(
        ID.unique(),
        formData?.email,
        formData?.password,
        formData?.name
      );
      setErrors({});
      const res = await fetch("/api/balance", {
        method: "POST",
        body: JSON.stringify({
          userId: data?.$id,
        }),
      });
      const balanceData = await res.json();
      if (!balanceData?.success) {
        toast.error(balanceData?.message);
        return;
      }
      login();
    } catch (error) {
      setErrors({
        general: error?.message,
      });
    }
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      if (isLogin) {
        login();
      } else {
        register();
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="flex justify-center items-center h-fit relative rounded-xl px-4 bg-gray-100 z-[3]">
      <Card className="w-fit md:w-[390px] shadow-none border-none bg-gray-100">
        <div
          className="absolute top-3 right-3 cursor-pointer"
          onClick={closeModal}
        >
          <X />
        </div>
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl text-center font-semibold">
            {isLogin ? "Login" : "Sign Up"}
          </CardTitle>
          <CardDescription className="text-center  text-sm md:text-base">
            {isLogin ? "Enter your credentials" : "Create a new account"}
          </CardDescription>
          <CardDescription className=" text-[12px] ">
            {errors?.general && (
              <p className=" text-red-500">{errors?.general}</p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className=" text-sm md:text-base">
            {!isLogin && (
              <div className="grid w-full items-center gap-4 mb-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
            )}
            <div className="grid w-full items-center gap-4 mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="grid w-full items-center gap-4 mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <Button
              disabled={isLoading}
              className="w-full disabled:cursor-not-allowed"
              type="submit"
            >
              {isLoading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              className="p-0"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Login"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
