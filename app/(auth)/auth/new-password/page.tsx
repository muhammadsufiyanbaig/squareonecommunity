"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);

  const validatePassword = (password: string) => {
    const criteria = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return criteria.test(password);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) {
      setPasswordValid(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    setPasswordMatch(true);
    setPasswordValid(true);
    // Handle form submission logic
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen py-10">
      <Card className="bg-white px-8 py-4 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center space-x-2 mb-6">
          <h1 className="text-xl font-semibold">Change Password</h1>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Update password for enhanced account security.
        </p>
        <form id="changePasswordForm" className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 block mb-2">
              New Password *
            </Label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`password-input form-input block w-full border ${!passwordMatch ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showNewPassword ?  (
                          <Eye className="h-5 w-5" />
                        ) : (
                          <EyeOff className="h-5 w-5" />
                        )}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-2">
              Confirm New Password *
            </Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`password-input form-input block w-full border ${!passwordMatch ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showConfirmPassword ? (
                          <Eye className="h-5 w-5" />
                        ) : (
                          <EyeOff className="h-5 w-5" />
                        )}
              </button>
            </div>
            {!passwordMatch && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
            {!passwordValid && (
              <p className="text-red-500 text-xs mt-1">Password does not meet criteria</p>
            )}
          </div>
          <div id="passwordCriteria" className="text-sm space-y-2">
            <p className="">Password Must contain:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>At least 1 uppercase</li>
              <li>At least 1 number</li>
              <li>At least 8 characters</li>
            </ul>
          </div>
          <div className="flex justify-between">
            <Button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Change Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
