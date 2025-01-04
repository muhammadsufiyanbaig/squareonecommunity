"use client";

import axiosInstance from "@/app/axiosInstanse";
import React, { useEffect, useState } from "react";
import { useAdStore, useBrandStore } from "@/lib/base";
import Link from "next/link";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import { findDeal } from "@/lib/index"; // Import brands and findDeal
import { Badge } from "@/components/ui/badge";

const page = () => {
  const { ads, setAds } = useAdStore();
  const { brands } = useBrandStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      const req = await axiosInstance.get("/ad/get");
      setAds(req.data.data);
      setLoading(false);
    };
    fetchAds();
  }, [setAds]);

  return (
    <div className="p-4">
      {loading ? (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-zinc-900 text-theme border p-2 rounded-xl relative shadow-md animate-pulse">
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
      ) : (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {ads.map((ad) => {
            const brand = brands.find((b) => b.brandid === ad.brandid);
            const deal = brands
              .flatMap((b) => b.deals)
              .find((d) => d.dealid === ad.dealid);
            return (
              <Link href={`/ads/${ad.id}`}
                key={ad.id}
                className="bg-white dark:bg-zinc-900 text-theme border p-2 rounded-xl relative shadow-md"
              >
                <div className="relative ">
                  <Image
                    src={ad.banner}
                    alt="Ad Banner"
                    height={1000}
                    width={1000}
                    className="rounded-xl border aspect-video object-cover object-center"
                  />
                </div>
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
                      <strong>Staring From:</strong> {" "}
                      <span>{new Date(ad.startat).toDateString()}</span>
                    </div>
                    <div>
                      <strong>Valid Until:</strong> {" "}
                      <span>{new Date(ad.endat).toDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          <Link
            href={"/ads/add"}
            className="bg-red-500 p-4 rounded-full w-fit text-white hover:bg-red-700 transition-colors duration-150 cursor-pointer flex items-center justify-center fixed z-50 bottom-8 right-8"
          >
            <CirclePlus />
          </Link>
        </div>
      )}
    </div>
  );
};

export default page;
