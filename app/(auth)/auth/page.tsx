"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className=" bg-gray-100 py-5 min-h-screen flex items-center">
      <div className="max-w-md w-full  mx-auto bg-white p-4 md:p-6 rounded-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={1000}
              height={1000}
              className="h-full w-full aspect-square"
            />
          </div>
        </div>

        {/* Login Form */}
        <form className="space-y-6">
          <h1 className="text-center text-red-600 text-3xl font-semibold">
            Login
          </h1>
          <div className="space-y-2">
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <Input
              id="email"
              type="text"
              placeholder="Email"
              className="w-full border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0 px-0"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0  px-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Forgot Password?
            </Link>
          </div>

          <Button className="w-full bg-red-600 hover:bg-red-700 h-10 rounded-lg text-sm">
            LOGIN
          </Button>
        </form>
      </div>
    </div>
  );
}
