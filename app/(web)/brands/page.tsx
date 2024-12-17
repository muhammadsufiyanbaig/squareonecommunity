import { Badge } from "@/components/ui/badge";
import { brands } from "@/lib";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
      {brands.map((brand, index) => (
        <div key={index} className="bg-white p-2 rounded-xl relative">
          <Link href={"/brands/channel"} className="absolute inset-0 z-20"/>
          <div className="relative ">
            <Image
              src={brand.banner}
              alt={brand.banner}
              width={1000}
              height={1000}
              className="rounded-xl border"
            />
            <Badge className="bg-red-500 absolute top-3 right-3">
              {brand.category}
            </Badge>
          </div>
          <div>
            <div className="flex  gap-6">
              <div className="relative h-20 aspect-square">
                <div className="aspect-square rounded-full h-20 border absolute -top-1/2 left-3">
                  <Image
                    src={brand.logoImage}
                    alt={brand.brandName}
                    width={1000}
                    height={1000}
                    className="rounded-full object-cover h-full w-full"
                  />
                </div>
              </div>
              <h4 className="font-semibold text-sm lg:text-xl mt-2">{brand.brandName}</h4>
            </div>
            <p className="-mt-6 text-sm pl-4 line-clamp-1">
              {brand.description}
            </p>
            <div className="flex  gap-2 justify-between p-4">
              <div>
                <p className="text-xs font-semibold mb-2">Start</p>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Clock className="h-4 w-4" />
                  <span>{brand.workingHours.start}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold mb-2">End</p>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Clock className="h-4 w-4" />
                  <span>{brand.workingHours.end}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;
