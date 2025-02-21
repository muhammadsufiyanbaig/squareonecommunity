"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopDeals } from "../components/top-deals";
import { Overview } from "../components/overview";
import { TopBrands } from "../components/top-brands";
import axiosInstance from "@/app/axiosInstanse";
import useAuthStore, { useBrandStore, useAdStore, useEventStore } from "@/lib/base";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // added error state
  const setUsers = useAuthStore((state) => state.setUsers);
  const setBrands = useBrandStore((state) => state.setBrands);
  const setAds = useAdStore((state) => state.setAds);
  const setEvents = useEventStore((state) => state.setEvents);
  const users = useAuthStore((state) => state.users);
  const brands = useBrandStore((state) => state.brands);
  const ads = useAdStore((state) => state.ads);
  const events = useEventStore((state) => state.events);

  useEffect(() => {
    const fetchData = async () => {
      const errors: string[] = [];
      const results = await Promise.allSettled([
        axiosInstance.get("/auth/allusers"),
        axiosInstance.get("/brand/admin/all/get"),
        axiosInstance.get("/ad/get"),
        axiosInstance.get("/event/admin/get"),
      ]);

      // Process Users
      if (results[0].status === "fulfilled") {
        const usersData = results[0].value.data.data;
        if (Array.isArray(usersData)) {
          setUsers(usersData);
        } else {
          console.error("Unexpected response format for users");
          setUsers([]);
          errors.push("Users");
        }
      } else {
        console.error("Error fetching users", results[0].reason);
        errors.push("Users");
      }

      // Process Brands
      if (results[1].status === "fulfilled") {
        const brandsData = results[1].value.data.data;
        if (Array.isArray(brandsData)) {
          setBrands(brandsData);
        } else {
          console.error("Unexpected response format for brands");
          setBrands([]);
          errors.push("Brands");
        }
      } else {
        console.error("Error fetching brands", results[1].reason);
        errors.push("Brands");
      }

      // Process Ads
      if (results[2].status === "fulfilled") {
        const adsData = results[2].value.data.data;
        if (Array.isArray(adsData)) {
          setAds(adsData);
        } else {
          console.error("Unexpected response format for ads");
          setAds([]);
          errors.push("Ads");
        }
      } else {
        console.error("Error fetching ads", results[2].reason);
        errors.push("Ads");
      }

      // Process Events
      if (results[3].status === "fulfilled") {
        const eventsData = results[3].value.data.data;
        if (Array.isArray(eventsData)) {
          setEvents(eventsData);
        } else {
          console.error("Unexpected response format for events");
          setEvents([]);
          errors.push("Events");
        }
      } else {
        console.error("Error fetching events", results[3].reason);
        errors.push("Events");
      }

      if (errors.length) {
        setError(`Error fetching: ${errors.join(", ")}`);
      }
      setLoading(false);
    };
    fetchData();
  }, [setUsers, setBrands, setAds, setEvents]);

  if (loading) {
    return (
      <div className="flex-col md:flex w-full">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
          <div className="grid">
            <div className="animate-pulse">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <div className="col-span-3 animate-pulse">
              <div className="h-72 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="col-span-3 animate-pulse">
              <div className="h-72 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col md:flex w-full">
      {/* { error && <div className="bg-red-100 p-4 mb-4 text-red-700">{error}</div> } */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                All Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                All Brands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brands.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brands.reduce((acc, brand) => acc + (brand.deals?.length || 0), 0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                All Ads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ads.length}</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid">
          <Card>
            <CardHeader className="!px-2 md:px-6">
              <CardTitle>Code </CardTitle>
              <CardContent className="!px-2 md:px-6">
                <Overview />
              </CardContent>
            </CardHeader>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="col-span-3">
            <CardHeader className="!px-2 md:px-6">
              <CardTitle>Top Deals</CardTitle>
              <CardContent className="!px-2 md:px-6">
                <TopDeals />
              </CardContent>
            </CardHeader>
          </Card>
          <Card className="col-span-3">
            <CardHeader className="!px-2 md:px-6">
              <CardTitle>Top Brands</CardTitle>
              <CardContent className="!px-2 md:px-6">
                <TopBrands />
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
