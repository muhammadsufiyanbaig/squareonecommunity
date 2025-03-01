"use client";

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
import { usePathname, useRouter } from "next/navigation";
import NotFound from "@/app/(web)/not-found";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Page = ({ params }: { params: Promise<{ deal: string }> }) => {
  const [dealId, setDealId] = useState<string>("");
  const [foundedDeal, setFoundedDeal] = useState<Deal | null>(null);
  const [showNotFound, setShowNotFound] = useState<boolean>(false);
  const { brands } = useBrandStore();
  const pathname = usePathname();
  const brandName = pathname.split("/")[2];
  const router = useRouter();

  useEffect(() => {
    params.then((unwrappedParams) => {
      setDealId(unwrappedParams.deal);
    });
  }, [params]);

  useEffect(() => {
    const foundDeal = findDeal(
      brands,
      decodeURIComponent(brandName),
      decodeURIComponent(dealId)
    );
    setFoundedDeal(foundDeal || null);
  }, [brands, brandName, dealId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!foundedDeal) {
        setShowNotFound(true);
      }
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timer);
  }, [foundedDeal, router]);

  if (showNotFound) {
    return <NotFound />;
  }

  if (!foundedDeal) {
    return (
      <div className="p-4 text-theme">
        <div className="animate-pulse">
          <div className="h-72 bg-gray-300 dark:bg-zinc-800/80 p-1 rounded-xl mb-4"></div>
          <div className="h-36 aspect-square bg-gray-200 dark:bg-zinc-700/80 rounded-full ml-6 mb-4 -mt-14"></div>
          <div className="pl-44 -mt-20">
            <div className="h-8 bg-gray-300 dark:bg-zinc-800/80 rounded mb-1 w-[150px]"></div>
            <div className="h-4 bg-gray-300 dark:bg-zinc-800/80 rounded mb-4 w-[250px]"></div>
          </div>
          <div className="flex items-end flex-col">
            <div className="h-8 bg-gray-300 dark:bg-zinc-800/80 rounded mb-4 w-[250px]"></div>
            <div className="h-8 bg-gray-300 dark:bg-zinc-800/80 rounded mb-4 w-[250px]"></div>
          </div>
          <div className="h-10 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2 w-[150px]"></div>
          <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2"></div>
          <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2 w-10/12"></div>

          <div className="user-table !mt-8 px-4">
            <div className="h-10 bg-gray-300 dark:bg-zinc-800/80 rounded mb-2 w-[150px]"></div>
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
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="h-12 w-12 bg-gray-300 dark:bg-zinc-800/80 rounded-full"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded w-24"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded w-24"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 bg-gray-300 dark:bg-zinc-800/80 rounded w-24"></div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-theme">
      {foundedDeal ? (
        <div>
          <div className="object-cover h-72 bg-white p-1 rounded-xl relative dark:bg-zinc-800/80">
            <Image
              src={foundedDeal.Banner}
              alt={foundedDeal.title}
              height={1000}
              width={1000}
              className="rounded-xl object-cover object-center h-full w-full"
            />
            <Badge className="bg-red-500 absolute top-3 right-3 text-white">
              {new Date(foundedDeal.createdAt).toDateString()}
            </Badge>
          </div>
          <div className="relative h-36 rounded-full aspect-square overflow-hidden -mt-14 ml-6 p-1 border dark:bg-zinc-700 bg-white">
            <Image
              src={foundedDeal.Picture}
              alt={foundedDeal.title}
              width={1000}
              height={1000}
              className="border h-full w-auto rounded-full aspect-square object-cover object-center"
            />
          </div>
          <div className="flex flex-col justify-start items-start my-4 pl-44 -mt-16">
            <h2 className="text-2xl font-semibold">{foundedDeal.title}</h2>
            <p>{foundedDeal.tagline}</p>
          </div>
          <div className="flex flex-wrap justify-end mt-2 px-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <strong>Starting From:</strong>
                <p>{new Date(foundedDeal.startDate).toDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <strong>Valid until:</strong>
                <p>{new Date(foundedDeal.endDate).toDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <strong>Code:</strong>
                <p>{foundedDeal.code}</p>
              </div>
            </div>
          </div>

          <div className="!mt-4 space-y-4 px-4 pb-10">
            <h2 className="text-2xl font-semibold">Description</h2>
            <p>{foundedDeal.description}</p>
          </div>

          <hr />
          <div className="user-table !mt-8 px-4">
            <h2 className="text-2xl font-semibold mb-4">Customer</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Picture</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>What'sApp</TableHead>
                  <TableHead>Redeem Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foundedDeal.redeem && foundedDeal.redeem.length > 0 ? (
                  foundedDeal.redeem.map((user, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Avatar>
                        <AvatarImage src={user.profileImage} />
                          <AvatarFallback>
                            {(() => {
                              const parts = user.fullName.trim().split(" ");
                              if (parts.length < 2) {
                                return parts[0].charAt(0).toUpperCase();
                              }
                              return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
                            })()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.whatsAppNo}</TableCell>
                      <TableCell>{new Date(user.createdAt).toDateString()}</TableCell>
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
          <Link
            href={`${foundedDeal.dealid}/editDeal?dealname=${encodeURIComponent(
              foundedDeal.dealid
            )}`}
            className="bg-red-500 p-4 rounded-full w-fit text-white hover:bg-red-700 transition-colors duration-150 cursor-pointer flex items-center justify-center fixed bottom-8 right-8"
          >
            <Pencil />
          </Link>
        </div>
      ) : (
        <p>Deal not found</p>
      )}
    </div>
  );
};

export default Page;
