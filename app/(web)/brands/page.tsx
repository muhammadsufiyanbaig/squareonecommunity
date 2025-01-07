"use client";

import NoDataFound from "@/app/components/NoDataFound";
import { Badge } from "@/components/ui/badge";
import { Brand, getBrands } from "@/lib";
import { useBrandStore } from "@/lib/base";
import { CirclePlus, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GrDocumentMissing } from "react-icons/gr";

const Page = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { brands, setBrands } = useBrandStore();
  const [brandData, setBrandData] = useState<Brand[]>(brands);

  useEffect(() => {
    const fetchBrandsData = async () => {
      const data = await getBrands();
      setBrands(data || []);
      setBrandData(data || []);
      setLoading(false);
    };

    fetchBrandsData();
  }, [setBrands]);

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
          <div className="relative ">
            <Image
              src={brand.logoimage}
              alt={brand.brandid}
              width={1000}
              height={1000}
              className="rounded-xl border aspect-video object-cover object-center"
            />
            <Badge className="bg-red-500 absolute top-3 right-3 text-white">
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
  );
};

export default Page;
