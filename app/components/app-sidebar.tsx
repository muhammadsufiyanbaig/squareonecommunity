import {
  BellRing,
  BetweenHorizontalStart,
  CalendarDays,
  ChevronDown,
  Handshake,
  Home,
  Settings,
  SquareChartGantt,
  UserRoundCheck,
  UserRoundPlus,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    dropdown: false,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    dropdown: false,
  },
  {
    title: "Brands",
    url: "/brands",
    icon: SquareChartGantt,
    dropdown: true,
  },
  {
    title: "Events",
    url: "/events",
    icon: CalendarDays,
    dropdown: false,
  },
  {
    title: "Notification",
    url: "/notification",
    icon: BellRing,
    dropdown: false,
  },
  {
    title: "Ads",
    url: "/ads",
    icon: BetweenHorizontalStart,
    dropdown: false,
  },
  {
    title: "Register Admin",
    url: "/register",
    icon: UserRoundPlus,
    dropdown: false,
  },
  {
    title: "Admin Profile",
    url: "/profile",
    icon: UserRoundCheck,
    dropdown: false,
  },
  {
    title: "Support",
    url: "/support",
    icon: Handshake,
    dropdown: false,
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
                    <div>
                      <item.icon />
                      <div className="flex items-center w-full">
                        <Link href={item.url} className="flex-1">
                          {item.title}
                        </Link>
                        {item.dropdown && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <ChevronDown className="h-4 w-4 cursor-pointer" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className="w-56"
                              align="end"
                              forceMount
                            >
                              <DropdownMenuGroup>
                                <DropdownMenuItem>
                                  <Link className="flex-1" href={"/brands"}>All Brands</Link>
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                <DropdownMenuItem>
                                  <Link className="flex-1" href={"/brands/add"}>Add Brands</Link>
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
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
