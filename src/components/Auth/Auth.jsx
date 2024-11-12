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
import { useLocale, useTranslations } from "next-intl";
import { host } from "@/config";

export default function Auth({ closeModal }) {
  const signUpTrans = useTranslations("SignUp");
  const loginTrans = useTranslations("Login");

  const locale = useLocale();
  
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

  const handleWithGoogle = async () => {
    try {
      account.createOAuth2Session(
        "google",
        `${host}/${locale}/success`,
        `${host}/${locale}/fail?type=google`
      );
    } catch (error) {
      console.error(error);
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
            {isLogin ? loginTrans("title") : signUpTrans("title")}
          </CardTitle>
          <CardDescription className="text-center  text-sm md:text-base">
            {isLogin ? loginTrans("p") : signUpTrans("p")}
          </CardDescription>
          <CardDescription className=" text-[12px] ">
            {errors?.general && (
              <p className=" text-red-500">{errors?.general}</p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className=" w-full">
            <Button
              disabled={isLoading}
              className="w-full disabled:cursor-not-allowed outline-1 outline"
              onClick={handleWithGoogle}
              variant="outline"
            >
              {isLoading
                ? signUpTrans("btnLoading")
                : isLogin
                ? loginTrans("withGoogleBtn")
                : signUpTrans("withGoogleBtn")}
            </Button>
            <p className=" text-gray-700 text- text-center my-3">{signUpTrans("or")}</p>
          </div>
          <form onSubmit={handleSubmit} className=" text-sm md:text-base">
            {!isLogin && (
              <div className="grid w-full items-center gap-4 mb-4">
                <Label htmlFor="name">{signUpTrans("inputNameLabel")}</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder={signUpTrans("inputNamePlaceholder")}
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
            )}
            <div className="grid w-full items-center gap-4 mb-4">
              <Label htmlFor="email">{signUpTrans("inputEmailLabel")}</Label>
              <Input
                type="email"
                id="email"
                placeholder={signUpTrans("inputEmailPlaceholder")}
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="grid w-full items-center gap-4 mb-4">
              <Label htmlFor="password">{signUpTrans("inputPasswordLabel")}</Label>
              <Input
                type="password"
                id="password"
                placeholder={signUpTrans("inputPasswordPlaceholder")}
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
              {isLoading ? signUpTrans("btnLoading") : isLogin ? loginTrans("actionBtn") : signUpTrans("actionBtn")}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full ">
            {isLogin ? loginTrans("question") : signUpTrans("question")}
            <Button
              variant="link"

              className="p-0 ml-1"
              onClick={() => setIsLogin(!isLogin)}
            >{" "}
              {isLogin ? signUpTrans("actionBtn") : loginTrans("actionBtn")}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
