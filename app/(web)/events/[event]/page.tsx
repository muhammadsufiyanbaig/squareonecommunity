"use client"

import React, { useEffect, useState } from "react";
import { useEventStore } from "@/lib/base";
import Image from "next/image";
import { Calendar, ChartSpline, Clock, Pencil, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Events } from "@/lib";

const Page = ({ params }: { params: Promise<{ event: string }> }) => {
  const { events } = useEventStore();
  const [eventTitle, setEventTitle] = useState<string | null>(null);
  const [event, setEvent] = useState<Events | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setEventTitle(decodeURIComponent(resolvedParams.event));
    };
    fetchParams();
  }, [params]);

  useEffect(() => {
    if (eventTitle) {
      const foundEvent = events.find((e) => e.title === eventTitle);
      setEvent(foundEvent || null);
    }
  }, [eventTitle, events]);

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-muted-foreground text-theme">Event not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 text-theme">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">{event.title}</h1>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.start_date).toDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.end_date).toDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="prose prose-gray max-w-none">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Activities
            </h2>
            <Carousel className="w-full max-w-xl mx-auto"
            opts={{
              align: "start",
              loop: true,
            }}
            >
              <div className="flex items-center justify-end gap-2 mt-4 pr-4">
                <CarouselPrevious className="relative left-0 right-0 top-0 bottom-0" />
                <CarouselNext className="relative left-0 right-0 top-0 bottom-0" />
              </div>
              <CarouselContent>
                {event.activities.map((activity, index) => (
                  <CarouselItem key={index}>
                    <Card className="border-2">
                      <CardContent className="aspect-[4/3] relative p-0">
                        <Image
                          src={activity}
                          alt={`Activity ${index + 1}`}
                          fill
                          className="object-contain rounded-lg"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>

        {/* Right Column */}
        <div className="h-fit">
          <div className="grid gap-4 sm:grid-cols-2 mb-4 mt-14">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Likes</p>
                    <p className="text-sm text-muted-foreground">{event.liked}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <ChartSpline className="h-4 w-4 text-primary" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Total Going</p>
                    <p className="text-sm text-muted-foreground">{event.going}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="aspect-[9/16] relative rounded-xl overflow-hidden">
            <h1 className="text-3xl font-bold py-6">Background Image</h1>
            <Image
              src={event.background}
              alt={event.title}
              height={1000}
              width={1000}
              className="object-cover object-right rounded-xl h-full w-full"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>
      <Link
        href={`/events/${eventTitle}/edit?title=${event.title}`}
        className="bg-red-500 p-4 rounded-full w-fit text-white hover:bg-red-700 transition-colors duration-150 cursor-pointer flex items-center justify-center fixed bottom-8 right-8 z-50"
      >
        <Pencil />
      </Link>
    </div>
  );
};

export default Page;
