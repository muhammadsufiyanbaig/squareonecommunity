"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react"; // Import the X icon
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import axios from "axios";

export default function EventForm() {
  const [uploadedBackgroundUrl, setUploadedBackgroundUrl] = useState<string | null | any>(null);
  const [uploadedBannerUrl, setUploadedBannerUrl] = useState<string | null | any>(null);
  const [backgroundLoading, setBackgroundLoading] = useState<boolean>(false);
  const [bannerLoading, setBannerLoading] = useState<boolean>(false);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [activityImages, setActivityImages] = useState<string[] | any>([]);
  const [activityLoading, setActivityLoading] = useState<boolean>(false);
  const [activityError, setActivityError] = useState<string | null>(null);

  const uploadToCloudinary = async (
    file: File,
    setUrl: (url: string | null | (string | null)[] | ((prev: string[] | null) => string[] | null)) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void,
    multiple: boolean = false
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      if (multiple) {
        setUrl((prev: string[] | null) => (prev ? [...prev, response.data.secure_url] : [response.data.secure_url]));
      } else {
        setUrl(response.data.secure_url);
      }
      setLoading(false);
    } catch (error: any) {
      console.error(
        "Cloudinary Upload Error:",
        error.response ? error.response.data : error
      );
      setError("Failed to upload image. Please try again.");
      setLoading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: (url: string | null | (string | null)[] | ((prev: string[] | null) => string[] | null)) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void,
    multiple: boolean = false
  ) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          uploadToCloudinary(file, setUrl, setLoading, setError, multiple);
        }
      });
    }
  };

  const handleRemoveImage = (
    setUrl: (url: string | null | (string | null)[] | ((prev: string[] | null) => string[] | null)) => void,
    index: number | null = null
  ) => {
    if (index !== null) {
      setUrl((prev: string[] | null) => prev?.filter((_, i) => i !== index) || []);
    } else {
      setUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      background: uploadedBackgroundUrl,
      banner: uploadedBannerUrl,
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      activities: activityImages,
    };
    console.log(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Event Title" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Event Description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" name="startDate" type="date" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" name="endDate" type="date" required />
          </div>

          <div className="space-y-2">
            <Label>Background</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors border-gray-300 hover:border-primary">
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
                      onClick={() => handleRemoveImage(setUploadedBackgroundUrl)}
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
            </div>
          </div>

          <div className="space-y-2">
            <Label>Banner</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors border-gray-300 hover:border-primary">
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
                      onClick={() => handleRemoveImage(setUploadedBannerUrl)}
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
                      Drag & drop your banner image here, or click to select
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Activities</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors border-gray-300 hover:border-primary">
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
                          onClick={() => handleRemoveImage(setActivityImages, index)}
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
            </div>
          </div>

          <Button type="submit" className="w-full bg-red-500 hover:bg-red-400 text-white">
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}
