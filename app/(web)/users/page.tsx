"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronUp } from "lucide-react";
import axiosInstance from "@/app/axiosInstanse";

interface User {
  id: number;
  whatsappno: string;
  fullname: string;
  dateofbirth: string;
  location: string;
  gender: "Male" | "Female" | "Other";
  lastlogin: string;
  profileImage: string;
  createdat: string;
}

export default function UserTable() {
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/auth/allusers");
        console.log(response.data.data)
        if (Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        } else {
          console.error("Unexpected response format: ", response.data);
          setUsers([]);
        }
      } catch (err) {
        console.error("Error fetching users", err);
        setUsers([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  

  const filteredAndSortedUsers = useMemo(() => {
    return users
      .filter((user) =>
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (user) =>
          !locationFilter ||
          locationFilter === "all" ||
          user.location === locationFilter
      )
      .filter(
        (user) =>
          !genderFilter ||
          genderFilter === "all" ||
          user.gender === genderFilter
      )
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return a.fullname.localeCompare(b.fullname);
        } else {
          return b.fullname.localeCompare(a.fullname);
        }
      });
  }, [searchTerm, locationFilter, genderFilter, sortOrder, users]);

  const locations = Array.from(new Set(users.map((user) => user.location)));
  const genders = Array.from(new Set(users.map((user) => user.gender)));

  if (loading) {
    return (
      <div className="space-y-4 px-2 pt-4">
        <div className="flex gap-4 flex-wrap">
          <div className="h-8 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2 w-[180px]"></div>
          <div className="h-8 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2 w-[180px]"></div>
          <div className="h-8 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2 w-[180px]"></div>
        </div>
        <Table>
          <TableHeader className="bg-red-100 dark:bg-[#C12835] dark:text-white">
            <TableRow>
              <TableHead>Profile Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>WhatsApp No</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Register At</TableHead>
              <TableHead>Last Login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-10 w-10 bg-gray-300 dark:bg-zinc-800/80 rounded-full"></div>
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded w-24"></div>
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded w-24"></div>
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded w-24"></div>
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded w-24"></div>
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded w-24"></div>
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded w-24"></div>
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded w-24"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-2 pt-4">
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[180px] px-2 py-1 border rounded-md dark:bg-zinc-700"
        />
        <div className="flex gap-4">
          <Select onValueChange={(value) => setLocationFilter(value || null)}>
            <SelectTrigger className="w-1/2 sm:w-[180px] dark:bg-zinc-700 dark:text-white">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {locations.map((location) => (
                <SelectItem
                  key={location}
                  value={location}
                  className={
                    locationFilter === location
                      ? "!bg-red-100 hover:!bg-red-200"
                      : ""
                  }
                >
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setGenderFilter(value || null)}>
            <SelectTrigger className="w-1/2 sm:w-[180px] dark:bg-zinc-700 dark:text-white">
              <SelectValue placeholder="Filter by gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All genders</SelectItem>
              {genders.map((gender) => (
                <SelectItem
                  key={gender}
                  value={gender}
                  className={
                    genderFilter === gender
                      ? "!bg-red-100 hover:!bg-red-200"
                      : ""
                  }
                >
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table className="text-theme">
        <TableHeader className="bg-red-100 dark:bg-[#C12835] dark:text-white">
          <TableRow>
            <TableHead>Profile Image</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              Name{" "}
              {sortOrder === "asc" ? (
                <ChevronUp className="inline" />
              ) : (
                <ChevronDown className="inline" />
              )}
            </TableHead>
            <TableHead>WhatsApp No</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Register At</TableHead>
            <TableHead>Last Login</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            filteredAndSortedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={user.profileImage} alt={user.fullname} />
                    <AvatarFallback>
                      {user.fullname
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{user.fullname}</TableCell>
                <TableCell>{user.whatsappno}</TableCell>
                <TableCell>{user.dateofbirth}</TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{new Date(user.createdat).toDateString()}</TableCell>
                <TableCell>{new Date(user.lastlogin).toDateString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
