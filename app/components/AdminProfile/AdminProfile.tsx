"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Edit, Eye, EyeOff, Lock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/lib/base";
import axiosInstance from "@/app/axiosInstanse";

export default function AdminProfile() {
  const pathname = usePathname();
  const isEditMode = pathname.includes("edit");
  const { id, email, fullname } = useAuthStore();
  const [adminName, setAdminName] = useState("");
  const [adminOldEmail, setAdminOldEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    id: id,
    fullName: "",
    email: "",
    hashedPassword: "", 
  });
  useEffect(() => {
    setAdminName(fullname);
    setAdminOldEmail(email);
  }, [fullname, email]);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.hashedPassword) {
      alert("Please fill in all fields before submitting");
      return;
    }

    console.log(formData)

    try {
      setLoading(true);
      const response = await axiosInstance.put(
        "/admin/auth/profile/edit",
        formData,
        {withCredentials: true}
      );

      if (response.status === 200 || response.status === 201) {
        const { id, email, fullname } = response.data.data[0];
        setAdminName(fullname);
        setAdminOldEmail(email);
        alert("Profile updated successfully");
      }
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);
      const errorMsg =
        error.response?.data?.message || "An error occurred. Please try again";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData({ fullName: fullname, email: email, id: id, hashedPassword: "" });
  }, [fullname, email, id]);

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gray-100 dark:bg-zinc-900">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {isEditMode ? "Edit Profile" : "Admin Profile"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-500" />
                <Input
                  id="fullname"
                  value={adminName}
                  name="fullName"
                  onChange={(e) => {
                    setAdminName(e.target.value);
                    setFormData({ ...formData, fullName: e.target.value });
                  }}
                  readOnly={!isEditMode}
                  className="pl-2"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-gray-500" />
                <Input
                  id="email"
                  value={adminOldEmail}
                  type="email"
                  name="email"
                  onChange={(e) => {
                    setAdminOldEmail(e.target.value);
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  readOnly={!isEditMode}
                  className="pl-2"
                />
              </div>
            </div>

            {isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="hashedPassword" className="text-sm font-medium">
                  Password
                </Label>
                <div className="flex items-center">
                <Lock className="w-5 h-5 mr-2 text-gray-500" />
                  <Input
                    id="hashedPassword"
                    value={formData.hashedPassword}
                    type={showPassword ? "text" : "password"}
                    name="hashedPassword"
                    onChange={(e) =>
                      setFormData({ ...formData, hashedPassword: e.target.value })
                    }
                    className="pl-2"
                  />
                  <button
                    type="button"
                    onClick={handlePasswordToggle}
                    className="ml-2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {isEditMode ? (
              <Button
                className="w-full relative bg-red-500 hover:bg-red-600 text-white"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            ) : (
              <Link href="/profile/edit" className="w-full">
                <Button className="w-full relative bg-red-500 hover:bg-red-600 text-white">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
