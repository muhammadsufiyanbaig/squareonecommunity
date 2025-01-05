"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAdStore, useBrandStore } from "@/lib/base";
import { Ad } from "@/lib";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Pencil, Store } from "lucide-react";
import Link from "next/link";
import NoDataFound from "./NoDataFound";

// Skeleton component for loading state
function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-72 bg-gray-300 rounded"></div>

      <div className="flex justify-between">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
              <div className="h-6 bg-gray-300 rounded w-[200px]"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
              <div className="h-6 bg-gray-300 rounded w-[200px]"></div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-4 sm:flex-row md:flex-col">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-300 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-[200px]"></div>
                <div className="h-4 bg-gray-300 rounded w-[150px]"></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-300 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-[200px]"></div>
                <div className="h-4 bg-gray-300 rounded w-[150px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdDetails({ adId }: { adId: string }) {
  const [adSolo, setAdSolo] = useState<Ad | null>(null);
  const [brandName, setBrandName] = useState<string>("");
  const [dealTitle, setDealTitle] = useState<string>("");
  const [brandImage, setBrandImage] = useState<string>("");
  const [dealImage, setDealImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { ads } = useAdStore();
  const { brands } = useBrandStore();

  useEffect(() => {
    const singleAd = ads.find((ad) => ad.id === adId);
    setAdSolo(singleAd || null);

    if (singleAd) {
      const brand = brands.find((brand) => brand.brandid === singleAd.brandid);
      if (brand) {
        setBrandName(brand.brandname);
        setBrandImage(brand.logoimage);
        const deal = brand.deals.find(
          (deal) => deal.dealid === singleAd.dealid
        );
        if (deal) {
          setDealTitle(deal.title);
          setDealImage(deal.Picture);
        }
      }
    }

    // Set a timeout to stop loading after 5 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [ads, adId, brands]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Skeleton />
      </div>
    );
  }

  if (!adSolo) {
    return (
      <NoDataFound/>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative h-72">
            <Image
              src={adSolo.banner}
              alt={adSolo.id || "Banner"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-background/20" />
            <Badge
              variant="secondary"
              className="absolute top-4 right-4 text-sm font-medium"
            >
              Active Ad
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-muted-foreground">
                  Brand
                </h5>
                <Link href={`/brands/${brandName}`} className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={brandImage} alt={brandName} />
                    <AvatarFallback>
                      {brandName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold">{brandName}</h1>
                </Link>
              </div>
              {dealImage && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-muted-foreground">
                    Current Deal
                  </h5>
                  <Link href={`/brands/${brandName}/${dealTitle}`} className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={dealImage} alt={brandName} />
                      <AvatarFallback>
                        {dealTitle.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-lg font-semibold">{dealTitle}</h2>
                  </Link>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row md:flex-col">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Starting From</p>
                  <p className="font-medium">
                    {new Date(adSolo.startat).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valid Until</p>
                  <p className="font-medium">
                    {new Date(adSolo.endat).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Link
        href={`${adSolo.id}/edit`}
        className="bg-red-500 p-4 rounded-full w-fit text-white hover:bg-red-700 transition-colors duration-150 cursor-pointer flex items-center justify-center fixed bottom-8 right-8 z-50"
      >
        <Pencil />
      </Link>
    </div>
  );
}
