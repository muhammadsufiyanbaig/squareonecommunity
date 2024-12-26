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
import { User, Mail, Edit, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminProfile() {
  const pathname = usePathname();
  const isEditMode = pathname.includes("edit");
  const [showPassword, setShowPassword] = useState(false);
  const [adminName, setAdminName] = useState("John Doe");
  const [adminEmail, setAdminEmail] = useState("john.doe@example.com");

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gray-100 dark:bg-zinc-900">
      <Card className="w-full max-w-md">
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
                onChange={(e) => setAdminName(e.target.value)}
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
                value={adminEmail}
                type="email"
                onChange={(e) => setAdminEmail(e.target.value)}
                readOnly={!isEditMode}
                className="pl-2"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
        <Button className="w-full relative bg-red-500 hover:bg-red-600 text-white">
          {isEditMode ? (
              "Save Changes"
          ) : (
            <>
              <Link href="/profile/edit" className="absolute inset-0" />
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </>
            )}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
