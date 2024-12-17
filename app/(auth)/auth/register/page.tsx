"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid min-h- screen grid-cols-1 md:grid-cols-[45%_auto]">
      {/* Left section */}
      <div className="relative hidden bg-black md:block">
        <div className="flex h-full flex-col justify-between">
          <Image
            src={"/sqmall.png"}
            alt="Image"
            height={1000}
            width={1000}
            className="opacity-30 h-screen w-full object-cover"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center justify-center p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-red-700">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter infornation below to create your account
            </p>
          </div>
          <div className="grid gap-6">
            <form>
              <div className="grid gap-2">
                <div className="grid grid-rows-3 gap-2">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="text"
                      autoCorrect="off"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pass">Password</Label>
                    <div className="relative">
                      <Input
                        id="pass"
                        placeholder="*****"
                        type={showPassword ? "text" : "password"}
                        autoCapitalize="none"
                        autoComplete="text"
                        autoCorrect="off"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                        {showPassword ? (
                          <Eye className="h-5 w-5" />
                        ) : (
                          <EyeOff className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Create
                </Button>
              </div>
            </form>
          </div>

          <div className="text-center">
            <Link
              href="/admin"
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Alredy have an account? Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
