"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailValid(isValidEmail(newEmail));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setEmailValid(false);
      return;
    }
    window.location.href = "/auth/otp";
    // ...existing code...
  };

  return (
    <section className="min-h-screen flex items-center">
      <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
        <Card className="mt-7 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Forgot password?
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Remember your password?{" "}
                <Link
                  className="text-red-600 decoration-2 hover:underline font-medium"
                  href="/auth"
                >
                  Login here
                </Link>
              </p>
            </div>

            <div className="mt-5">
              <form onSubmit={handleSubmit} method="POST">
                <div className="grid gap-y-4">
                  <div>
                    <Label
                      htmlFor="email"
                      className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                    >
                      Email address
                    </Label>
                    <div className="relative">
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm shadow-sm"
                        required
                        aria-describedby="email-error"
                        value={email}
                        onChange={handleEmailChange}
                      />
                    </div>
                    {!emailValid && (
                      <p className="text-red-600 text-xs mt-2" id="email-error">
                        Please include a valid email address so we can get back to you
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                  >
                    Reset password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Card>
      </main>
    </section>
  );
};

export default ForgotPassword;
