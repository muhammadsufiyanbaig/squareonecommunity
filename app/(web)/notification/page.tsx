"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrandStore, useEventStore } from "@/lib/base";
import Image from "next/image";
import axiosInstance from "@/app/axiosInstanse";
import { useToast } from "@/hooks/use-toast";
import { CheckIcon } from "lucide-react";
import { Deal, Events } from "@/lib";

export default function CustomForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
  });
  const [selectedDeal, setSelectedDeal] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const getAllDeals = useBrandStore((state) => state.getAllDeals);
  const getAllEvents = useEventStore((state) => state.getAllEvents);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [events, setEvents] = useState<Events[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (formData.type === "deal") {
        const dealsData = await getAllDeals();
        setDeals(dealsData);
      } else if (formData.type === "event") {
        const eventsData = await getAllEvents();
        setEvents(eventsData);
      }
    };
    fetchData();
  }, [formData.type, getAllDeals, getAllEvents]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      type: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      dealId: formData.type === "deal" ? selectedDeal : null,
      eventId: formData.type === "event" ? selectedEvent : null,
    };
    console.log("Form submitted:", payload);
    try {
      const response = await axiosInstance.post(
        "/notification/create",
        payload
      );
      console.log("Response:", response.data);
      if (response.status === 200 || response.status === 201) {
        toast({
          title: `Notification Create successfully`,
          description: (
            <div className="flex items-center">
              <span className="text-green-500 border border-green-500 rounded-full p-1 mr-2">
                <CheckIcon className="h-4 w-4" />
              </span>
              <span className="first-letter:capitalize">
                Notification Create successfully
              </span>
            </div>
          ),
        });
        setFormData({
          title: "",
          description: "",
          type: "",
        });
        setSelectedDeal("");
        setSelectedEvent("");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description:
          "There was an error submitting the form. Please try again.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gray-100 dark:bg-zinc-900 px-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-xl w-full mx-auto p-6 bg-white rounded-lg shadow-md"
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select onValueChange={handleSelectChange} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deal">Deal</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.type === "deal" && (
          <div className="space-y-2">
            <Label htmlFor="deals">Deal</Label>
            <Select
              name="deal"
              required
              value={selectedDeal}
              onValueChange={(value) => setSelectedDeal(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select deal" />
              </SelectTrigger>
              <SelectContent>
                {deals.length > 0 ? (
                  deals.map((deal) => (
                    <SelectItem key={deal.dealid} value={deal.dealid}>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <Image
                            src={deal.Picture}
                            alt={deal.title}
                            height={32}
                            width={32}
                            className="object-cover"
                          />
                        </div>
                        <span>{deal.title}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-deals">No deals available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.type === "event" && (
          <div className="space-y-2">
            <Label htmlFor="events">Event</Label>
            <Select
              name="event"
              required
              value={selectedEvent}
              onValueChange={(value) => setSelectedEvent(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                {events.length > 0 ? (
                  events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <Image
                            src={event.banner}
                            alt={event.title}
                            height={32}
                            width={32}
                            className="object-cover"
                          />
                        </div>
                        <span>{event.title}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-events">No events available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-500 text-white"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
