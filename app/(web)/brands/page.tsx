"use client";

import NoDataFound from "@/app/components/NoDataFound";
import { Badge } from "@/components/ui/badge";
import { Brand, getBrands } from "@/lib";
import { useBrandStore } from "@/lib/base";
import { CheckIcon, CirclePlus, CircleX, Clock, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GrDocumentMissing } from "react-icons/gr";
import axiosInstance from "@/app/axiosInstanse";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Spinner from "@/app/components/Spinner";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const { brands, setBrands } = useBrandStore();
  const [brandData, setBrandData] = useState<Brand[]>(brands);
  
  // New state for dialog and deletion loading
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [targetBrandId, setTargetBrandId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const fetchBrandsData = async () => {
      const data = await getBrands();
      setBrands(data || []);
      setBrandData(data || []);
      setLoading(false);
    };

    fetchBrandsData();
  }, [setBrands]);

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/brand/delete`, { data: { id: id } });
      setBrandData(brandData.filter(brandData => brandData.brandid !== id));
      toast({
        title: "Success",
        description: (
          <div className="flex items-center">
            <span className="text-green-500 border border-green-500 rounded-full p-1 mr-2">
              <CheckIcon className="h-4 w-4" />
            </span>
            <span className="first-letter:capitalize">
            Brand deleted successfully
            </span>
          </div>
        ),
        // variant: "default",
      });
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast({
        title: "Somthing went wrong",
        description: (
          <div className="flex items-center">
            <CircleX className="h-4 w-4 text-red-500 mr-2" />
            <span className="first-letter:capitalize">{"An unexpected error occurred"}</span>
          </div>
        ),
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
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
            <div className="h-4 bg-gray-300 rounded w-full mx-auto mt-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mx-auto mt-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mx-auto mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (brandData.length === 0) {
    return (
      <>
        <NoDataFound />
        <Link
        href={"/brands/add"}
        className="bg-red-500 p-4 rounded-full w-fit text-white hover:bg-red-700 transition-colors duration-150 cursor-pointer flex items-center justify-center fixed z-50 bottom-8 right-8"
      >
        <CirclePlus />
      </Link>
      </>
    );
  }

  return (
    <>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {brandData.map((brand, index) => (
          <div
            key={index}
            className="bg-white dark:bg-zinc-900 text-theme border p-2 rounded-xl relative shadow-md"
          >
            <Link
              href={`/brands/${brand.brandname}`}
              className="absolute inset-0 z-20"
            />
            <div className="relative rounded-lg">
              <div className="absolute top-3 right-3 flex items-center justify-center bg-white p-2 rounded-full shadow-md">
                <button
                  onClick={() => {
                    setTargetBrandId(brand.brandid);
                    setConfirmOpen(true);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors duration-150 relative z-50"
                >
                  <Trash className="h-6 w-6" />
                </button>
              </div>
              <Image
                src={brand.logoimage}
                alt={brand.brandid}
                width={1000}
                height={1000}
                className="rounded-xl border border-gray-300 aspect-video object-cover object-center"
              />
              <Badge className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium py-1 px-2 rounded-lg">
                {brand.category}
              </Badge>
            </div>

            <div>
              <div className="flex  gap-6">
                <h4 className="font-semibold text-sm lg:text-xl mt-2 ps-4">
                  {brand.brandname}
                </h4>
              </div>
              <p className="mt-2 text-sm px-4 line-clamp-3">
                {brand.description}
              </p>
            </div>
          </div>
        ))}

        <Link
          href={"/brands/add"}
          className="bg-red-500 p-4 rounded-full w-fit text-white hover:bg-red-700 transition-colors duration-150 cursor-pointer flex items-center justify-center fixed z-50 bottom-8 right-8"
        >
          <CirclePlus />
        </Link>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this brand?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => {
                setConfirmOpen(false);
                setTargetBrandId(null);
              }}
              disabled={isDeleting}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <Button
              onClick={async () => {
                if (targetBrandId) {
                  setIsDeleting(true);
                  await handleDelete(targetBrandId);
                  setIsDeleting(false);
                }
                setConfirmOpen(false);
                setTargetBrandId(null);
              }}
              className="px-4 py-2 !bg-red-500 text-white rounded-md flex items-center justify-center overflow-hidden"
            >
              {isDeleting ? (

                <Spinner />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Page;
