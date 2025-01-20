"use client";

import { getEvents } from "@/lib";
import { CirclePlus, Clock, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useEventStore } from "@/lib/base";
import NoDataFound from "@/app/components/NoDataFound";
import axiosInstance from "@/app/axiosInstanse";

const Page = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { events, setEvents } = useEventStore();

  useEffect(() => {
    const fetchEventsData = async () => {
      const data = await getEvents();
      setEvents(data || []);
      setLoading(false);
    };

    fetchEventsData();
  }, [setEvents]);



  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/event/delete`, { data: { id: id } });
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

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

  if (events.length === 0) {
    return (
      <>
        <NoDataFound />
        <Link
          href={"/events/add"}
          className="bg-red-500 p-4 rounded-full w-fit text-white hover:bg-red-700 transition-colors duration-150 cursor-pointer flex items-center justify-center fixed z-50 bottom-8 right-8"
        >
          <CirclePlus />
        </Link>
      </>
    );
  }

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
              <h4 className="font-semibold text-xl absolute top-2 left-2 text-white mt-2">{event.title}</h4>
            <div className="flex justify-between items-center absolute bottom-2 px-4 w-full text-white z-50">
              <div className="flex flex-col gap-2 p-4">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(event.start_date).toDateString()}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(event.end_date).toDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex p-2 bg-white rounded-full">              
              <button
                onClick={() => handleDelete(event.id)}
                className="text-red-500 hover:text-red-700 transition-colors duration-150"
              >
                <Trash className="h-6 w-6" />
              </button>
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

export default Page;
