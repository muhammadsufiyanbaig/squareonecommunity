import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { brands } from "@/lib";
import { Calendar, Clock, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import React, { use } from "react";
import { FaWhatsapp } from "react-icons/fa";

const Page = async ({ params }: { params: Promise<{ brand: string }> }) => {
  const brand = (await params).brand;
  console.log("Params", brand);

  return (
    <div className="p-4 text-theme">
      <div className="object-cover h-72 bg-white dark:bg-zinc-800/80 p-1 rounded-xl relative">
        <Image
          src={brands[0].banner}
          alt={brands[0].banner}
          height={1000}
          width={1000}
          className="rounded-xl object-cover h-full w-full"
        />
        <Badge className="bg-red-500 absolute top-3 right-3 text-white">
          {brands[0].category}
        </Badge>
      </div>
      <div>
        <div className="relative h-36 aspect-square mx-auto">
          <div className="aspect-square rounded-full h-full border absolute -top-1/2 left-3">
            <Image
              src={brands[0].logoImage}
              alt={brands[0].brandName}
              width={1000}
              height={1000}
              className="rounded-full object-cover h-full w-full"
            />
          </div>
        </div>
        <p className="font-semibold text-lg lg:text-3xl text-center -mt-16 pl-6 flex justify-center items-center gap-8">
          {brands[0].brandName}
        </p>
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center gap-2">
            <FaWhatsapp className="h-6 w-6" />
            {brands[0].brandWhatsappNo}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            <span>
              {brands[0].workingHours.start} - {brands[0].workingHours.end}
            </span>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <h2 className="text-2xl font-semibold">Description</h2>
          <p>
            {brands[0].description} Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Quaerat optio aliquam, quisquam totam iusto atque
            magnam reiciendis eveniet. Eius porro architecto ratione iure nemo
            consequuntur dolorum similique illo tempora doloribus.
          </p>
        </div>
        <Link href={`${brand}/edit`} className="bg-red-500 p-4 rounded-full w-fit text-white hover:bg-red-700 transition-colors duration-150 cursor-pointer flex items-center justify-center fixed bottom-8 right-8 z-50">
          <Pencil />
      </Link>
      </div>
      <div>
        <div className="mt-10 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold ">Deals</h1>
          <Link href={"brands/addDeal"}><Button className="bg-red-500 hover:bg-red-400 text-white">Add Deals</Button></Link>
        </div>
        <div className="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {brands[0].deals.map((deal, index) => (
            <div key={index} className="bg-white dark:bg-zinc-900 dark:border p-2 rounded-xl relative">
              <Link
                href={`/brands/${brands[0].brandName}/${deal.code}`}
                className="absolute inset-0 z-20"
              />
              <div className="relative ">
                <Image
                  src={"/deal.webp"}
                  alt={deal.title}
                  width={1000}
                  height={1000}
                  className="rounded-xl border"
                />
                <Badge className="bg-red-500 absolute top-3 right-3 text-white">
                  {deal.createdAt}
                </Badge>
              </div>
              <div>
                <div className="flex  gap-6">
                  <h4 className="font-semibold text-sm lg:text-xl mt-2">
                    {deal.title}
                  </h4>
                </div>
                <p className="text-lg line-clamp-1">{deal.tagline}</p>
                <div className="flex  gap-2 justify-between py-4">
                  <div>
                    <p className="text-xs font-semibold mb-2">Start</p>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Calendar className="h-4 w-4" />
                      <span>{deal.startDate}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-2">End</p>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Calendar className="h-4 w-4" />
                      <span>{deal.endDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
