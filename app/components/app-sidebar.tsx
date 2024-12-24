import { CalendarDays, Home, Settings, SquareChartGantt, UserRoundCheck, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Brands",
    url: "/brands",
    icon: SquareChartGantt,
  },
  {
    title: "Events",
    url: "/events",
    icon: CalendarDays,
  },
  {
    title: "Register Admin",
    url: "/auth/register",
    icon: UserRoundCheck,
  },
  {
    title: "Admin Profile",
    url: "/profile",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="py-10">
                  <div className="w-[40%] ">
                    <Image
                      src={"/logo.png"}
                      alt="Logo"
                      height={1000}
                      width={1000}
                      className="w-full object-cover"
                    />
                  </div>
                </div>
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
