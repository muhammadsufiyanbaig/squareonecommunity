"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie"; // Import js-cookie

const page = () => {
  const router = useRouter();
  useEffect(() => {
    const handleLogout = async () => {
      Cookies.remove("token"); // Remove token from cookie
      console.log("Token removed");
      router.push("/auth");
    };
    handleLogout();
  }, []);
};

export default page;
