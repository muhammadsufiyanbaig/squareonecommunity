"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Deal, WorkingHours } from "@/lib";
import { useBrandStore } from "@/lib/base";
import { Calendar, CheckIcon, CircleX, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import NotFound from "../../not-found";
import axiosInstance from "@/app/axiosInstanse";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/app/components/Spinner";

const Page = ({ params }: { params: Promise<{ brand: string }> }) => {
  const [brandName, setBrandName] = useState<string>("");
  const [show404, setShow404] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dealToDelete, setDealToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    params.then((unwrappedParams) => {
      setBrandName(unwrappedParams.brand);
    });
  }, [params]);

  const { brands, removeDeal } = useBrandStore();

  const brand = brands.find(
    (brand) => brand.brandname === decodeURIComponent(brandName)
  );

  useEffect(() => {
    if (!brand) {
      const timer = setTimeout(() => {
        setShow404(true);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [brand]);

  if (show404) {
    return <NotFound />;
  }

  function formatTime(time: string) {
    const [hour, minute] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  }

  if (!brand) {
    return (
      <div className="p-4 text-theme">
        <div className="animate-pulse">
          <div className="object-cover h-72 bg-gray-300 dark:bg-zinc-800/80 p-1 rounded-xl mb-4"></div>
          <div className="h-8 bg-gray-300 dark:bg-zinc-800/80 rounded mb-4 w-[150px] mx-auto"></div>
          <div className="flex justify-end">
            <div className="h-8 bg-gray-300 dark:bg-zinc-800/80 rounded mb-4 w-[150px]"></div>
          </div>
          <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2 w-[150px]"></div>
          <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2"></div>
          <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2 w-10/12"></div>
          <div className="flex flex-col gap-2 mt-6">
            <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2 w-[150px]"></div>
            {Array.from({ length: 7 }).map((_, index) => (
              <div className="flex gap-4" key={index}>
                <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2 w-[150px]"></div>
                <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2 w-[150px]"></div>
              </div>
            ))}
          </div>
          <div className="mt-10 px-4 flex justify-between items-center">
            <div className="h-8 bg-gray-300 dark:bg-zinc-800/80 rounded mb-4 w-[150px]"></div>
            <div className="h-8 bg-gray-300 dark:bg-zinc-800/80 rounded mb-4 w-[150px]"></div>
          </div>
          <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-900 text-theme border p-2 rounded-xl relative shadow-md animate-pulse"
              >
                <div className="relative h-48 bg-gray-300 rounded-xl"></div>
                <div className="flex gap-6 relative">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mt-4"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-[85%] mx-auto -mt-4"></div>
                <div className="flex gap-2 justify-between p-4 ">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const normalizedDeals: Deal[] = Array.isArray(brand?.deals)
    ? brand.deals
    : brand?.deals
    ? [brand.deals]
    : [];

  const validDeals = normalizedDeals.filter(
    (deal) =>
      deal.title &&
      deal.tagline &&
      deal.startDate &&
      deal.endDate &&
      deal.createdAt
  );

  const handleDelete = async () => {
    if (dealToDelete) {
      setIsDeleting(true);
      try {
        const response = await axiosInstance.delete(`/deal/delete`, {
          data: { id: dealToDelete },
        });
        removeDeal(dealToDelete);
        toast({
          title: "Success",
          description: (
            <div className="flex items-center">
              <span className="text-green-500 border border-green-500 rounded-full p-1 mr-2">
                <CheckIcon className="h-4 w-4" />
              </span>
              <span className="first-letter:capitalize">
                Deal delete successfully
              </span>
            </div>
          ),
        });
        router.refresh();
      } catch (error: any) {
        console.error("Failed to delete deal:", error);
        toast({
          title: "Somthing went wrong",
          description: (
            <div className="flex items-center">
              <span className="text-red-500 border border-red-500 rounded-full p-1 mr-2">
                <CircleX className="h-4 w-4 text-red-500 mr-2" />
              </span>
              <span className="first-letter:capitalize">
                {error.response?.data?.message || "Failed to delete deal"}
              </span>
            </div>
          ),
        });
      } finally {
        setIsDeleting(false);
        setShowDialog(false);
        setDealToDelete(null);
      }
    }
  };

  return (
    <div className="p-4 text-theme">
      <div className="object-cover h-72 bg-white dark:bg-zinc-800/80 p-1 rounded-xl relative">
        <Image
          src={brand!.logoimage}
          alt={brand!.brandname}
          height={1000}
          width={1000}
          className="rounded-xl object-cover h-full w-full"
        />
        <Badge className="bg-red-500 absolute top-3 right-3 text-white">
          {brand?.category}
        </Badge>
      </div>
      <div>
        <p className="font-semibold text-lg lg:text-3xl text-center mt-4 pl-6 flex justify-center items-center gap-8">
          {brand!.brandname}
        </p>
        <div className="flex justify-end">
          <div className="flex items-center gap-2 mt-3">
            <FaWhatsapp className="h-6 w-6" />
            {brand!.brandwhatsappno}
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <h2 className="text-2xl font-semibold">Description</h2>
          <p>{brand!.description}</p>
        </div>
        <Link
          href={`${brand?.brandname}/edit?brandname=${brand?.brandname}`}
          className="bg-red-500 p-4 rounded-full w-fit text-white hover:bg-red-700 transition-colors duration-150 cursor-pointer flex items-center justify-center fixed bottom-8 right-8 z-50"
        >
          <Pencil />
        </Link>
      </div>
      <div className="flex  flex-col gap-2 mt-6">
        <h2 className="text-2xl font-semibold">Working Hours</h2>
        <div>
          {JSON.parse(brand.workinghours as any).map((hours: WorkingHours, index: number) => (
            <div className="max-w-md" key={index}>
              {!hours.closes ? (
                <div key={index} className="grid grid-cols-2 mb-1">
                  <strong>{hours.day}: </strong>
                  <p>
                    <span>
                      {formatTime(hours.start)} - {formatTime(hours.end)}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 mb-1">
                  <strong>{hours.day}: </strong>
                  <div>
                    <span>off</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mt-10 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold ">Deals</h1>
          <Link href={`brands/${decodeURIComponent(brandName)}/addDeal`}>
            <Button className="bg-red-500 hover:bg-red-400 text-white">
              Add Deals
            </Button>
          </Link>
        </div>
        <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {validDeals.length > 0 ? (
            validDeals.map((deal, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-900 border p-2 rounded-xl relative"
              >
                <Link
                  href={`/brands/${brand?.brandname}/${deal.dealid}`}
                  className="absolute inset-0 z-20"
                />
                <div className="relative">
                  <Image
                    src={deal.Picture}
                    alt={deal.title}
                    width={1000}
                    height={1000}
                    className="rounded-xl border h-44 object-cover object-center"
                  />
                  <Badge className="bg-red-500 absolute top-3 right-3 text-white">
                    {deal.type.charAt(0).toUpperCase() + deal.type.slice(1)}
                  </Badge>
                  <span className="absolute z-50 top-2 left-2 bg-zinc-300 rounded-full p-1">
                    <Trash2
                      className="text-red-500 cursor-pointer"
                      onClick={() => {
                        setDealToDelete(deal.dealid);
                        setShowDialog(true);
                      }}
                    />
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm lg:text-xl mt-2">
                    {deal.title}
                  </h4>
                  <p className="text-base line-clamp-1">{deal.tagline}</p>
                  <div className="flex gap-2 justify-between py-4">
                    <div>
                      <p className="text-xs font-semibold mb-2">Start</p>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(deal.startDate).toDateString()}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-2">End</p>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(deal.endDate).toDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="px-4">No deals found for this brand.</p>
          )}
        </div>
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogTitle className="dark:text-white">Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this deal? This action cannot be
            undone.
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-400 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? <Spinner /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
