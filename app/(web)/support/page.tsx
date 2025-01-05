"use client";

import axiosInstance from "@/app/axiosInstanse";
import NoDataFound from "@/app/components/NoDataFound";
import Spinner from "@/app/components/Spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Check, CircleDotDashed } from "lucide-react";
import React, { useEffect, useState } from "react";
import { GrDocumentMissing, GrDocumentVerified } from "react-icons/gr";

interface Message {
  id: string;
  title: string;
  message: string;
  status: boolean;
  fullname: string;
  whatsappno: string;
}

const SkeletonCard = () => (
  <Card className="p-4 shadow-sm animate-pulse">
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-4" />
        </div>

        <div className="flex justify-between">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-[50px]"></div>
        </div>
      </div>
    </div>
  </Card>
);

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiLoading, setApiLoading] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"inProgress" | "resolved">("inProgress");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await axiosInstance.get("support/get");
        if (res.status === 200) {
          setMessages(res.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleResolve = async (id: string) => {
    setApiLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await axiosInstance.put("support/edit", {
        id,
        status: false,
      });
      if (res.status === 200) {
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === id ? { ...message, status: false } : message
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setApiLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredMessages = messages.filter((message) =>
    filter === "inProgress" ? message.status : !message.status
  );

  return (
    <div className="p-4">
      <div>
        <div className="flex justify-end gap-2">
          <Button
            variant={"secondary"}
            onClick={() => setFilter("inProgress")}
            className={
              filter === "inProgress"
                ? "!bg-black/60 dark:!bg-background text-white"
                : ""
            }
          >
            In Progress
          </Button>
          <Button
            className={`bg-red-400 hover:bg-red-600 !text-white ${
              filter === "resolved" ? "bg-red-600" : ""
            }`}
            onClick={() => setFilter("resolved")}
          >
            Resolved
          </Button>
        </div>

        <div>
          <div className="p-4">
            <div className="space-y-4">
              {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : messages.length === 0 ? (
                <NoDataFound/>
              ) : filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 text-gray-500 min-h-[60vh]">
                  <div>
                    {filter === "inProgress" ? (
                      <div className="flex flex-col items-center justify-center gap-4 text-gray-500 min-h-[60vh]">
                        <div>
                          <GrDocumentMissing className="h-24 w-24" />
                        </div>
                        <p>All complaints have been resolved</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-4 text-gray-500 min-h-[60vh]">
                        <div>
                          <GrDocumentMissing className="h-24 w-24" />
                        </div>
                        <p>No complaints have been resolved</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                filteredMessages.map((message, index) => (
                  <Card key={index} className="p-4 shadow-sm">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 flex justify-center items-center bg-muted rounded-full">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                          {message.fullname
                            .split(" ")
                            .slice(0, 2)
                            .map((word) => word[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">
                              {message.fullname}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              WhatsApp: {message.whatsappno}
                            </p>
                          </div>
                          <div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                            >
                              {message.status ? (
                                <CircleDotDashed className="h-4 w-4 text-red-500 animate-pulse" />
                              ) : (
                                <Check className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between ">
                          <p className="mt-2 text-sm">{message.message}</p>
                          {message.status && (
                            <Button
                              variant="destructive"
                              className="mt-2 max-h-6 max-w-16 flex justify-center py-1 px-2 text-xs"
                              onClick={() => handleResolve(message.id)}
                            >
                              {apiLoading[message.id] ? <Spinner /> : "Resolve"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
