import { events } from "@/lib";
import { CirclePlus, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
      {events.map((event, index) => (
        <div key={index} className="bg-white p-2 rounded-xl dark:bg-zinc-800">
          <div className="relative rounded-xl overflow-hidden">
            <Link
              href={`events/${encodeURIComponent(event.title)}`}
              className="absolute inset-0 z-20 bg-gradient-to-t from-black/40 to-transparent"
            />

            <Image
              src={event.banner}
              alt={event.banner}
              width={1000}
              height={1000}
              className="rounded-xl border h-64 w-full object-cover"
            />

            <div className="flex justify-between items-center absolute bottom-2 px-4 w-full text-white z-50">
              <h4 className="font-semibold text-xl mt-2">{event.title}</h4>
              <div className="flex flex-col gap-2  p-4">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-4 w-4" />
                    <span>{event.dates.start}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-4 w-4" />
                    <span>{event.dates.end}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Link
        href={"/events/add"}
        className="bg-red-500 p-4 rounded-full w-fit text-white hover:bg-red-700 transition-colors duration-150 cursor-pointer flex items-center justify-center fixed bottom-8 right-8 z-50"
      >
        <CirclePlus />
      </Link>
    </div>
  );
};

export default page;
