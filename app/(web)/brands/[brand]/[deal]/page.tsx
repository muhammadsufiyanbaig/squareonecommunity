import { Badge } from "@/components/ui/badge";
import { brands, users } from "@/lib";
import Image from "next/image";
import React from "react";
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

const Page = async ({ params }: { params: Promise<{ deal: string }> }) => {
  const deal = (await params).deal;

  console.log(deal)
  const brand = brands.find((brand) =>
    brand.deals.some((d) => d.code === deal)
  );
  const foundDeal = brand?.deals.find((d) => d.code === deal);
  const dealUsers = users.filter((user) =>
    user.selectedDeals.some((d) => d.dealCode === deal)
  );

  return (
    <div className="p-4 text-theme">
      {foundDeal ? (
        <div>
          <div className="object-cover h-72 bg-white p-1 rounded-xl relative dark:bg-zinc-800/80">
            <Image
              src={"/deal.webp"}
              alt={brands[0].banner}
              height={1000}
              width={1000}
              className="rounded-xl object-cover h-full w-full"
            />
            <Badge className="bg-red-500 absolute top-3 right-3 text-white">
              {foundDeal.createdAt}
            </Badge>
          </div>
          <div className="flex flex-wrap justify-between mt-2 px-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">{foundDeal.title}</h2>
              <p>{foundDeal.tagline}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <strong>Starting From:</strong>
                <p>{foundDeal.startDate}</p>
              </div>
              <div className="flex items-center gap-2">
                <strong>Valid until:</strong>
                <p>{foundDeal.endDate}</p>
              </div>
            </div>
            <div className="!mt-4 space-y-4">
              <h2 className="text-2xl font-semibold">Description</h2>
              <p>
                {foundDeal.description} Lorem ipsum dolor sit, amet consectetur
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
                  <TableHead>User Details</TableHead>
                  <TableHead>Brand Logo</TableHead>
                  <TableHead>Brand Name</TableHead>
                  <TableHead>Deal Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dealUsers[0] ? (
                  dealUsers.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell>
                        <Image
                          src="/user-pic-placeholder.jpg"
                          alt={user.name}
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                      </TableCell>
                      <TableCell className="flex flex-col justify-center">
                        <span>{user.name}</span>
                        <span>{user.whatAppNo}</span>
                      </TableCell>
                      <TableCell>
                        <Image
                          src={brand?.logoImage || ""}
                          alt={brand?.brandName || ""}
                          width={1000}
                          height={1000}
                          className="rounded-full aspect-square object-cover h-12 w-12"
                        />
                      </TableCell>
                      <TableCell>{brand?.brandName}</TableCell>
                      <TableCell>{deal}</TableCell>
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
          <Link href={`${deal}/editDeal`} className="bg-red-500 p-4 rounded-full w-fit text-white hover:bg-red-700 transition-colors duration-150 cursor-pointer flex items-center justify-center fixed bottom-8 right-8">
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
