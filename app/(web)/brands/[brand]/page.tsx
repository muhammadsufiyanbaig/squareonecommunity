"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Deal } from "@/lib";
import { useBrandStore } from "@/lib/base";
import { Calendar, Clock, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const Page = ({ params }: { params: Promise<{ brand: string }> }) => {
  const [brandName, setBrandName] = useState<string>("");


  useEffect(() => {
    params.then((unwrappedParams) => {
      setBrandName(unwrappedParams.brand);
    });
  }, [params]);

  const { brands } = useBrandStore();

  const brand = brands.find((brand) => brand.brandname === decodeURIComponent(brandName));

  if (!brand) {
    return (
      <div className="p-4 text-theme">
        <div className="animate-pulse">
          <div className="h-72 bg-gray-300 dark:bg-zinc-800/80 p-1 rounded-xl mb-4"></div>
          <div className="h-36 aspect-square bg-gray-200 dark:bg-zinc-700/80 rounded-full mx-auto mb-4 -mt-20"></div>
          <div className="h-8 bg-gray-300 dark:bg-zinc-800/80 rounded mb-4 w-[150px] mx-auto"></div>
          <div className="flex justify-between">
            <div className="h-8 bg-gray-300 dark:bg-zinc-800/80 rounded mb-4 w-[150px]"></div>
            <div className="h-8 bg-gray-300 dark:bg-zinc-800/80 rounded mb-4 w-[150px]"></div>
          </div>
          <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2 w-[150px]"></div>
          <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2"></div>
          <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2 w-10/12"></div>
          <div className="flex justify-between">
            <div className="h-8 bg-gray-300 dark:bg-zinc-800/80 rounded mb-4 w-[150px]"></div>
            <div className="h-8 bg-gray-300 dark:bg-zinc-800/80 rounded mb-4 w-[150px]"></div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-zinc-900 text-theme border p-2 rounded-xl relative shadow-md animate-pulse">
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

  const validDeals = normalizedDeals.filter(deal => 
    deal.title && deal.tagline && deal.startDate && deal.endDate && deal.createdAt
  );

  return (
    <div className="p-4 text-theme">
      <div className="object-cover h-72 bg-white dark:bg-zinc-800/80 p-1 rounded-xl relative">
        <Image
          src={
            "https://res.cloudinary.com/dvabwft9d/image/upload/v1735544512/3_j253di.jpg"
          }
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
        <div className="relative h-36 aspect-square mx-auto">
          <div className="aspect-square rounded-full h-full border absolute -top-1/2 left-3">
            <Image
              src={brand!.logoimage}
              alt={brand!.brandname}
              width={1000}
              height={1000}
              className="rounded-full object-cover h-full w-full"
            />
          </div>
        </div>
        <p className="font-semibold text-lg lg:text-3xl text-center -mt-16 pl-6 flex justify-center items-center gap-8">
          {brand!.brandname}
        </p>
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-2">
            <FaWhatsapp className="h-6 w-6" />
            {brand!.brandwhatsappno}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            <span>
              {brand!.workinghours.split("to")[0]}{" "}
              {brand!.workinghours.split("to")[1]}
            </span>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <h2 className="text-2xl font-semibold">Description</h2>
          <p>
            {brand!.description}
          </p>
        </div>
        <Link
          href={`${brand?.brandname}/edit?brandname=${brand?.brandname}`}
          className="bg-red-500 p-4 rounded-full w-fit text-white hover:bg-red-700 transition-colors duration-150 cursor-pointer flex items-center justify-center fixed bottom-8 right-8 z-50"
        >
          <Pencil />
        </Link>
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
                  href={`/brands/${brand?.brandname}/${deal.title}`}
                  className="absolute inset-0 z-20"
                />
                <div className="relative">
                  {/* <Image
                    src={deal.Picture || brand?.logoimage}
                    alt={deal.title}
                    width={1000}
                    height={1000}
                    className="rounded-xl border h-56 object-cover object-center"
                  /> */}
                  <Image
                    src={brand!.logoimage}
                    alt={deal.title}
                    width={1000}
                    height={1000}
                    className="rounded-xl border h-56 object-cover object-center"
                  />
                  <Badge className="bg-red-500 absolute top-3 right-3 text-white">
                    {new Date(deal.createdAt).toDateString()}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm lg:text-xl mt-2">
                    {deal.title}
                  </h4>
                  <p className="text-lg line-clamp-1">{deal.tagline}</p>
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
    </div>
  );
};

export default Page;
