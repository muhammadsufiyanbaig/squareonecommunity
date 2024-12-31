"use client"

import { Badge } from "@/components/ui/badge";
import { Deal, findDeal } from "@/lib";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useBrandStore } from "@/lib/base";
import { usePathname } from "next/navigation";

const Page =  ({ params }: { params: { deal: string } }) => {
  const [dealTitle, setDealTitle] = useState<string>(params.deal);
  const [foundedDeal, setFoundedDeal] = useState<Deal | null>(null);

  const { brands } = useBrandStore();
  const pathname = usePathname();
  const brandName = pathname.split("/")[2];

  useEffect(() => {
    const foundDeal = findDeal(brands, decodeURIComponent(brandName), decodeURIComponent(dealTitle)); 
    setFoundedDeal(foundDeal || null);
  }, [brands, brandName, dealTitle]);
  
  return (
    <div className="p-4 text-theme">
      {foundedDeal ? (
        <div>
          <div className="object-cover h-72 bg-white p-1 rounded-xl relative dark:bg-zinc-800/80">
            <Image
              src={"/deal.webp"}
              alt={"brands[0]"}
              height={1000}
              width={1000}
              className="rounded-xl object-cover h-full w-full"
            />
            <Badge className="bg-red-500 absolute top-3 right-3 text-white">
              {new Date(foundedDeal.createdAt).toDateString()}
            </Badge>
          </div>
          <div className="flex flex-wrap justify-between mt-2 px-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">{foundedDeal.title}</h2>
              <p>{foundedDeal.tagline}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <strong>Starting From:</strong>
                <p>{new Date(foundedDeal.startDate).toDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <strong>Valid until:</strong>
                <p>{new Date(foundedDeal.endDate).toDateString()}</p>
              </div>
            </div>
            <div className="!mt-4 space-y-4">
              <h2 className="text-2xl font-semibold">Description</h2>
              <p>
                {foundedDeal.description} Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Quaerat optio aliquam, quisquam totam iusto
                atque magnam reiciendis eveniet. Eius porro architecto ratione
                iure nemo consequuntur dolorum similique illo tempora doloribus.
              </p>
            </div>
          </div>

          <div className="user-table !mt-8 px-4">
            <h2 className="text-2xl font-semibold mb-4">Customer</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Picture</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Brand What'sApp</TableHead>
                  <TableHead>Deal Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foundedDeal.code && foundedDeal.code.length > 0 ? (
                  foundedDeal.code.map((user, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Image
                          src={user.profileImage || "/user-pic-placeholder.jpg"}
                          alt={user.fullName}
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                      </TableCell>
                      <TableCell className="flex flex-col justify-center">
                        <span>{user.fullName}</span>
                      </TableCell>
                      <TableCell>{user.whatsAppNo}</TableCell>
                      <TableCell>{user.code}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <p>No users found for this deal</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* <Link href={`${deal}/editDeal`} className="bg-red-500 p-4 rounded-full w-fit text-white hover:bg-red-700 transition-colors duration-150 cursor-pointer flex items-center justify-center fixed bottom-8 right-8">
          <Pencil />
      </Link> */}
        </div>
      ) : (
        <p>Deal not found</p>
      )}
    </div>
  );
};

export default Page;
