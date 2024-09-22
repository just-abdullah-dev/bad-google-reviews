"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, User2, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/store/userSlice";
import { account } from "@/lib/app_write_client";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const logout = async () => {
    dispatch(clearUser());
    await account.deleteSession("current");
    window.location.reload();
  };
  return (
    <header
      className={`${
        isMenuOpen ? " bg-gray-100 " : " bg-white "
      } fixed top-0 w-full z-50 duration-700 transition-all h-fit `}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-8">
        {/* Brand Name */}
        <div className="text-2xl font-bold">
          <Link href={"/"} className=" text-lg font-semibold">
            Brand Name
          </Link>
        </div>

        {/* Center Navigation Links (Hidden on mobile) */}
        <nav className="hidden md:flex space-x-8">
          <Link
            href="/"
            className="hover:scale-[1.1] duration-500 transition-all"
          >
            Home
          </Link>
          <Link
            href="/topup"
            className="hover:scale-[1.1] duration-500 transition-all"
          >
            Topup
          </Link>
          <Link
            href="/orders"
            className="hover:scale-[1.1] duration-500 transition-all"
          >
            Orders
          </Link>
        </nav>

        {/* Right Side Avatar and Balance */}
        <div className="hidden md:flex items-center space-x-4 relative">
          <span className="font-semibold">
            € {Number(user.balance).toFixed(2)}
          </span>
          <div className="flex items-center gap-2 cursor-pointer group">
            <User2
              strokeWidth={1.5}
              className="w-8 h-8 border-[2px] rounded-full border-black"
            />
            <ChevronDown />
            <div className=" group-hover:opacity-100 opacity-0 duration-500 transition-all bg-white rounded-xl overflow-hidden absolute top-[40px] right-0">
              <p className=" py-2 pl-6 pr-8 hover:bg-gray-200 duration-300 transition-all cursor-pointer">
                Profile
              </p>
              <p
                onClick={logout}
                className=" py-2 pl-6 pr-8 hover:bg-gray-200 duration-300 transition-all cursor-pointer text-red-600"
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden transition-all absolute bottom-[calc(64px-100vh)] w-full h-[calc(100vh-64px)] duration-700 bg-gray-100 ease-in py-4 px-8 ${
          isMenuOpen ? " right-0 " : " right-[-45rem] "
        }`}
      >
        <div className="flex justify-end items-center space-x-4 text-lg">
          <span className="font-semibold">
            € {Number(user.balance).toFixed(2)}
          </span>
          <div className="flex items-center gap-2 cursor-pointer group">
            <User2
              strokeWidth={1.5}
              className="w-8 h-8 border-[2px] rounded-full border-black"
            />
            <ChevronDown />
            <div className=" group-hover:opacity-100 opacity-0 duration-500 transition-all bg-white rounded-xl overflow-hidden absolute top-[55px] right-[16px]">
              <p className=" py-2 pl-6 pr-8 hover:bg-gray-200 duration-300 transition-all cursor-pointer">
                Profile
              </p>
              <p
                onClick={logout}
                className=" py-2 pl-6 pr-8 hover:bg-gray-200 duration-300 transition-all cursor-pointer text-red-600"
              >
                Logout
              </p>
            </div>
          </div>
        </div>
        <nav className=" p-4 space-y-4 flex flex-col text-3xl ">
          <Link
            href="/"
            className="hover:translate-x-6 w-fit duration-700 transition-all"
          >
            Home
          </Link>
          <Link
            href="/topup"
            className="hover:translate-x-6 w-fit duration-700 transition-all"
          >
            Topup
          </Link>
          <Link
            href="/orders"
            className="hover:translate-x-6 w-fit duration-700 transition-all"
          >
            Orders
          </Link>
        </nav>
      </div>
    </header>
  );
}
