"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CircleX, Upload, X } from "lucide-react"; // Import the X icon
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import axios from "axios";
import { Events, uploadToCloudinary } from "@/lib";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner";
import { useEventStore } from "@/lib/base";
import axiosInstance from "@/app/axiosInstanse";

interface EventFormProps {
  title?: string;
}

export default function EventForm({ title }: EventFormProps) {
  const [uploadedBackgroundUrl, setUploadedBackgroundUrl] = useState<
    string | null
  >(null);
  const [uploadedBannerUrl, setUploadedBannerUrl] = useState<string | null>(
    null
  );
  const [backgroundLoading, setBackgroundLoading] = useState<boolean>(false);
  const [bannerLoading, setBannerLoading] = useState<boolean>(false);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [activityImages, setActivityImages] = useState<string[]>([]);
  const [activityLoading, setActivityLoading] = useState<boolean>(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [reqLoading, setReqLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const [fetching, setFetching] = useState<boolean>(false);
  const [tempEvent, setTempEvent] = useState<Events | null>(null);
  const { events, updateEvent, addEvent } = useEventStore();

  useEffect(() => {
    if (title) {
      setFetching(true);
      const event = events.find((e) => e.title === title);
      if (event) {
        setTempEvent(event);
        setUploadedBackgroundUrl(event.background);
        setUploadedBannerUrl(event.banner);
        setActivityImages(event.activities);
      }
      setFetching(false);
    }
  }, [title, events]);

  const validateForm = (data: any) => {
    const newErrors: { [key: string]: string | null } = {};
    if (!data.title) newErrors.title = "Title is required.";
    if (!data.description) newErrors.description = "Description is required.";
    if (!data.start_date) newErrors.startDate = "Start Date is required.";
    if (!data.end_date) newErrors.endDate = "End Date is required.";
    if (!data.background)
      newErrors.background = "Background image is required.";
    if (!data.banner) newErrors.banner = "Banner image is required.";
    if (data.activities.length === 0)
      newErrors.activities = "At least one activity image is required.";
    return newErrors;
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: (url: string | null | string[] | any) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void,
    multiple: boolean = false
  ) => {
    const files = e.target.files;
    if (files) {
      setLoading(true);
      setError(null);
      setErrors((prevErrors) => ({
        ...prevErrors,
        background: null,
        banner: null,
        activities: null,
      }));
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          const url = await uploadToCloudinary(file);
          if (url) {
            urls.push(url);
          } else {
            setError("Failed to upload image. Please try again.");
            setLoading(false);
            return;
          }
        }
      }
      if (multiple) {
        (setUrl as (url: string[] | null) => void)(urls);
      } else {
        setUrl(urls[0] || null);
      }
      setLoading(false);
    }
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    setUrl: (url: string | null | string[] | any) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void,
    multiple: boolean = false
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files) {
      setLoading(true);
      setError(null);
      setErrors((prevErrors) => ({
        ...prevErrors,
        background: null,
        banner: null,
        activities: null,
      }));
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          const url = await uploadToCloudinary(file);
          if (url) {
            urls.push(url);
          } else {
            setError("Failed to upload image. Please try again.");
            setLoading(false);
            return;
          }
        }
      }
      if (multiple) {
        (setUrl as (url: string[] | null) => void)(urls);
      } else {
        setUrl(urls[0] || null);
      }
      setLoading(false);
    }
  };

const handleRemoveSingleImage = (setUrl: (url: string | null) => void) => {
  setUrl(null);
};

const handleRemoveMultipleImages = (
  setUrl: (url: (prev: string[] | null) => string[]) => void,
  index: number
) => {
  setUrl((prev: string[] | null) => (prev ? prev.filter((_, i) => i !== index) : []));
};


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? null : prevErrors[name],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReqLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data: {
      title: string | null;
      description: string | null;
      background: string | null;
      banner: string | null;
      start_date: string | null;
      end_date: string | null;
      activities: string[];
      id?: string;
      liked?: string;
      going?: string;
    } | any = {
      title: formData.get("title") as string | null,
      description: formData.get("description") as string | null,
      background: uploadedBackgroundUrl,
      banner: uploadedBannerUrl,
      start_date: formData.get("startDate") as string | null,
      end_date: formData.get("endDate") as string | null,
      activities: activityImages || [],
    };

    const formErrors = validateForm(data);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setReqLoading(false);
      return;
    }

    try {
      let response;
      if (tempEvent) {
        data.id = tempEvent.id;
        data.liked = tempEvent.liked;
        data.going = tempEvent.going;
        response = await axiosInstance.put(
          "/event/edit",
          data
        );
        updateEvent(data);
      } else {
        response = await axiosInstance.post(
          "/event/create",
          data
        );
        addEvent(response.data);
      }

      toast({
        title: tempEvent ? "Event Updated" : "Event Created",
        description: (
          <div className="flex items-center">
            <span className="text-green-500 border border-green-500 rounded-full p-1 mr-2">
              <CheckIcon className="h-4 w-4" />
            </span>
            <span className="first-letter:capitalize">
              Event {tempEvent ? "updated" : "created"} successfully
            </span>
          </div>
        ),
      });

      // Clear all fields
      setUploadedBackgroundUrl(null);
      setUploadedBannerUrl(null);
      setActivityImages([]);
      setErrors({});
      (e.target as HTMLFormElement).reset();

      // Redirect to the appropriate page
      if (tempEvent) {
        router.push(`/events/${data.title}`);
      } else {
        router.push("/events");
      }
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: (
          <div className="flex items-center">
            <CircleX className="h-4 w-4 text-red-500 mr-2" />
            <span className="first-letter:capitalize">{error.message}</span>
          </div>
        ),
      });
      console.error("Error creating event:", error);
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Event Title"
              defaultValue={tempEvent?.title || ""}
              className={errors.title ? "border-red-500" : ""}
              onChange={handleInputChange}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Event Description"
              defaultValue={tempEvent?.description || ""}
              className={errors.description ? "border-red-500" : ""}
              onChange={handleInputChange}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              defaultValue={tempEvent?.start_date?.split("T")[0] || ""}
              className={errors.startDate ? "border-red-500" : ""}
              onChange={handleInputChange}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              defaultValue={tempEvent?.end_date?.split("T")[0] || ""}
              className={errors.endDate ? "border-red-500" : ""}
              onChange={handleInputChange}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Background</Label>
            <div
              onDrop={(e) =>
                handleDrop(
                  e,
                  setUploadedBackgroundUrl,
                  setBackgroundLoading,
                  setBackgroundError
                )
              }
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                errors.background
                  ? "border-red-500"
                  : "border-gray-300 hover:border-primary"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="backgroundUpload"
                name="background"
                onChange={(e) =>
                  handleFileChange(
                    e,
                    setUploadedBackgroundUrl,
                    setBackgroundLoading,
                    setBackgroundError
                  )
                }
              />
              <label
                htmlFor="backgroundUpload"
                className="flex flex-col items-center justify-center min-h-36"
              >
                {uploadedBackgroundUrl ? (
                  <div className="relative">
                    <Image
                      src={uploadedBackgroundUrl}
                      alt="Uploaded Background"
                      height={1000}
                      width={1000}
                      className="h-full w-36 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveSingleImage(setUploadedBackgroundUrl)
                      }
                      className="absolute top-0 right-0 p-1 bg-white rounded-full"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ) : backgroundLoading ? (
                  <p className="text-lg text-gray-500">Uploading...</p>
                ) : backgroundError ? (
                  <p className="text-sm text-red-500">{backgroundError}</p>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drag & drop your background image here, or click to select
                    </p>
                  </>
                )}
              </label>
              {errors.background && (
                <p className="text-red-500 text-sm">{errors.background}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Banner</Label>
            <div
              onDrop={(e) =>
                handleDrop(
                  e,
                  setUploadedBannerUrl,
                  setBannerLoading,
                  setBannerError
                )
              }
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                errors.banner
                  ? "border-red-500"
                  : "border-gray-300 hover:border-primary"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="bannerUpload"
                name="banner"
                onChange={(e) =>
                  handleFileChange(
                    e,
                    setUploadedBannerUrl,
                    setBannerLoading,
                    setBannerError
                  )
                }
              />
              <label
                htmlFor="bannerUpload"
                className="flex flex-col items-center justify-center min-h-36"
              >
                {uploadedBannerUrl ? (
                  <div className="relative">
                    <Image
                      src={uploadedBannerUrl}
                      alt="Uploaded Banner"
                      height={1000}
                      width={1000}
                      className="h-full w-36 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSingleImage(setUploadedBannerUrl)}
                      className="absolute top-0 right-0 p-1 bg-white rounded-full"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ) : bannerLoading ? (
                  <p className="text-lg text-gray-500">Uploading...</p>
                ) : bannerError ? (
                  <p className="text-sm text-red-500">{bannerError}</p>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drag & drop your banner here, or click to select
                    </p>
                  </>
                )}
              </label>
              {errors.banner && (
                <p className="text-red-500 text-sm">{errors.banner}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Activities</Label>
            <div
              onDrop={(e) =>
                handleDrop(
                  e,
                  setActivityImages,
                  setActivityLoading,
                  setActivityError,
                  true
                )
              }
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                errors.activities
                  ? "border-red-500"
                  : "border-gray-300 hover:border-primary"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="activityUpload"
                name="activities"
                onChange={(e) =>
                  handleFileChange(
                    e,
                    setActivityImages,
                    setActivityLoading,
                    setActivityError,
                    true
                  )
                }
              />
              <label
                htmlFor="activityUpload"
                className="flex flex-col items-center justify-center min-h-36"
              >
                {activityImages.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {activityImages.map((url: string, index: number) => (
                      <div key={index} className="relative">
                        <Image
                          src={url}
                          alt={`Activity ${index + 1}`}
                          height={1000}
                          width={1000}
                          className="h-full w-36 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveMultipleImages(setActivityImages, index)
                          }
                          className="absolute top-0 right-0 p-1 bg-white rounded-full"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : activityLoading ? (
                  <p className="text-lg text-gray-500">Uploading...</p>
                ) : activityError ? (
                  <p className="text-sm text-red-500">{activityError}</p>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drag & drop activity images here, or click to select
                    </p>
                  </>
                )}
              </label>
              {errors.activities && (
                <p className="text-red-500 text-sm">{errors.activities}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-400 text-white"
            disabled={reqLoading}
          >
            {reqLoading ? <Spinner /> : "Submit"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
