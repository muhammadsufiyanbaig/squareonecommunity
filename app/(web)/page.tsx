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
      try {
        const [usersResponse, brandsResponse, adsResponse, eventsResponse] = await Promise.all([
          axiosInstance.get("/auth/allusers"),
          axiosInstance.get("/brand/admin/all/get"),
          axiosInstance.get("/ad/get"),
          axiosInstance.get("/event/admin/get"),
        ]);

        if (Array.isArray(usersResponse.data.data)) {
          setUsers(usersResponse.data.data);
        } else {
          console.error("Unexpected response format: ", usersResponse.data);
        }

        if (Array.isArray(brandsResponse.data.data)) {
          setBrands(brandsResponse.data.data);
        } else {
          console.error("Unexpected response format: ", brandsResponse.data);
        }

        if (Array.isArray(adsResponse.data.data)) {
          setAds(adsResponse.data.data);
        } else {
          console.error("Unexpected response format: ", adsResponse.data);
        }

        if (Array.isArray(eventsResponse.data.data)) {
          setEvents(eventsResponse.data.data);
        } else {
          console.error("Unexpected response format: ", eventsResponse.data);
        }
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
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
