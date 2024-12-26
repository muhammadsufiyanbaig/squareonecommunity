"use client";

import React from "react";
import { UserNav } from "./user-nav";
import { usePathname } from "next/navigation";

const Header = () => {
    let pathName: string = decodeURIComponent(usePathname().split("/").pop()?.split("").map((char, i) => i === 0 ? char.toUpperCase() : char).join("") || "");
    if (pathName === "") {
        pathName = "Dashboard"
    }   
  return (
    <div className="pt-10 dark:bg-zinc-900 bg-zinc-50">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold text-theme">{pathName}</h1>
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
