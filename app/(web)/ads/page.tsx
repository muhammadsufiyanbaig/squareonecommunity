"use client";

import axiosInstance from "@/app/axiosInstanse";
import React, { useEffect, useState } from "react";
import { useAdStore, useBrandStore } from "@/lib/base";
import Link from "next/link";
import { CheckIcon, CirclePlus, CircleX, Trash2 } from "lucide-react";
import Image from "next/image";
import NoDataFound from "@/app/components/NoDataFound";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Spinner from "@/app/components/Spinner";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
const page = () => {
  const { ads, setAds, removeAd } = useAdStore();
  const { brands } = useBrandStore();
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { toast } = useToast();
    const router = useRouter();


  useEffect(() => {
    const fetchAds = async () => {
      try {
        const req = await axiosInstance.get("/ad/get");
        setAds(req.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [setAds]);

  const handleDelete = async () => {
    if (adToDelete) {
      setIsDeleting(true);
      try {
        const response = await axiosInstance.delete(`/ad/delete`, {
          data: { id: adToDelete },
        });
        toast({
          title: "Success",
          description: (
            <div className="flex items-center">
              <span className="text-green-500 border border-green-500 rounded-full p-1 mr-2">
                <CheckIcon className="h-4 w-4" />
              </span>
              <span className="first-letter:capitalize">
                Ad delete successfully
              </span>
            </div>
          ),
        });
        removeAd(adToDelete);
        router.refresh();
      } catch (error: any) {
        console.error("Failed to delete ad:", error);
        toast({
          title: "Somthing went wrong",
          description: (
            <div className="flex items-center">
              <span className="text-red-500 border border-red-500 rounded-full p-1 mr-2">
                <CircleX className="h-4 w-4 text-red-500 mr-2" />
              </span>
              <span className="first-letter:capitalize">
                {error.response?.data?.message || "Failed to delete ad"}
              </span>
            </div>
          ),
        });
      } finally {
        setIsDeleting(false);
        setShowDialog(false);
        setAdToDelete(null);
      }
    }
  };

  return (
    <div className="p-4">
      {loading ? (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 text-theme border p-2 rounded-xl relative shadow-md animate-pulse"
            >
              <div className="relative h-56 w-full bg-gray-300 rounded-xl aspect-video"></div>
              <div className="flex justify-between flex-wrap mt-4">
                <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
              </div>
              <div className="flex justify-between flex-wrap mt-4">
                <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : ads.length === 0 ? (
        <NoDataFound />
      ) : (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {ads.map((ad) => {
            const brand = brands.find((b) => b.brandid === ad.brandid);
            const deal = brands
              .flatMap((b) => b.deals)
              .find((d) => d.dealid === ad.dealid);
            return (
              <div
                key={ad.id}
                className="flex flex-col bg-white dark:bg-zinc-900 text-theme border p-2 rounded-xl relative shadow-md"
              >
                 <span className="absolute z-50 top-4 right-4 bg-zinc-300 rounded-full p-1">
                    <Trash2
                      className="text-red-500 cursor-pointer"
                      onClick={() => {
                        setAdToDelete(ad.id);
                        setShowDialog(true);
                      }}
                    />
                  </span>
                <Link href={`/ads/${ad.id}`}>
                  <div className="relative ">
                    <Image
                      src={ad.banner}
                      alt="Ad Banner"
                      height={1000}
                      width={1000}
                      className="rounded-xl border aspect-video object-cover object-center"
                    />
                  </div>
                </Link>

                <div className="flex justify-between flex-wrap">
                  <div>
                    {brand && (
                      <div className="mt-4">
                        <h5 className="font-semibold text-lg">Brand:</h5>
                        <Link
                          href={`/brands/${brand.brandname}`}
                          className="flex items-center gap-2 mt-2"
                        >
                          <Image
                            src={brand.logoimage}
                            alt="Brand Logo"
                            height={1000}
                            width={1000}
                            className="rounded-full h-8 w-8 border aspect-square"
                          />
                          <span className="ml-2">{brand.brandname}</span>
                        </Link>
                      </div>
                    )}
                    {deal && (
                      <div className="mt-4">
                        <h5 className="font-semibold text-lg">Deal:</h5>
                        <Link
                          href={`/brands/${brand!.brandname}/${deal.title}`}
                          className="mt-2 flex items-center gap-2"
                        >
                          <Image
                            src={deal.Picture}
                            alt="Brand Logo"
                            height={1000}
                            width={1000}
                            className="rounded-full h-8 w-8 border aspect-square"
                          />
                          <span className="text-sm text-gray-500">
                            {deal.title}
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 mt-5">
                    <div>
                      <strong>Staring From:</strong>{" "}
                      <span>{new Date(ad.startat).toDateString()}</span>
                    </div>
                    <div>
                      <strong>Valid Until:</strong>{" "}
                      <span>{new Date(ad.endat).toDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Link
        href={"/ads/add"}
        className="bg-red-500 p-4 rounded-full w-fit text-white hover:bg-red-700 transition-colors duration-150 cursor-pointer flex items-center justify-center fixed z-50 bottom-8 right-8"
      >
        <CirclePlus />
      </Link>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogTitle className="dark:text-white">Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this ad? This action cannot be
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

export default page;
