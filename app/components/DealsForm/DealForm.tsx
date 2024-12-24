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

export default function DealForm() {
  const [uploadedPictureUrl, setUploadedPictureUrl] = useState<string | null>(null);
  const [uploadedBannerUrl, setUploadedBannerUrl] = useState<string | null>(null);
  const [pictureLoading, setPictureLoading] = useState<boolean>(false);
  const [bannerLoading, setBannerLoading] = useState<boolean>(false);
  const [pictureError, setPictureError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);

  const uploadToCloudinary = async (
    file: File,
    setUrl: (url: string | null) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );
    try {
      setUrl(null);
      setLoading(true);
      setError(null);
      setPictureError(null);
      setBannerError(null);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setUrl(response.data.secure_url);
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
    setUrl: (url: string | null) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      uploadToCloudinary(file, setUrl, setLoading, setError); // Upload the file immediately
    }
  };

  const handleRemoveImage = (
    setUrl: (url: string | null) => void,
    setError: (error: string | null) => void
  ) => {
    setUrl(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      brandId: formData.get("brandId"),
      title: formData.get("title"),
      description: formData.get("description"),
      tagline: formData.get("tagline"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      picture: uploadedPictureUrl,
      banner: uploadedBannerUrl,
      createdBy: new Date().toISOString(),
    };
    console.log(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Deal Title" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Deal Description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" name="tagline" placeholder="Tagline" required />
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
            <Label>Picture</Label>
            <div className="border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-colors border-gray-300 hover:border-primary">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="pictureUpload"
                name="picture"
                onChange={(e) => handleFileChange(e, setUploadedPictureUrl, setPictureLoading, setPictureError)}
              />
              <label
                htmlFor="pictureUpload"
                className="flex flex-col items-center justify-center min-h-36"
              >
                {uploadedPictureUrl ? (
                  <div className="relative">
                    <Image
                      src={uploadedPictureUrl}
                      alt="Uploaded Picture"
                      height={1000}
                      width={1000}
                      className="h-full w-36 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(setUploadedPictureUrl, setPictureError)}
                      className="absolute top-0 right-0 p-1 bg-white rounded-full"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ) : pictureLoading ? (
                  <p className="text-lg text-gray-500">Uploading...</p>
                ) : pictureError ? (
                  <p className="text-sm text-red-500">{pictureError}</p>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drag & drop your picture here, or click to select
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Banner</Label>
            <div className="border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-colors border-gray-300 hover:border-primary">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="bannerUpload"
                name="banner"
                onChange={(e) => handleFileChange(e, setUploadedBannerUrl, setBannerLoading, setBannerError)}
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
                      onClick={() => handleRemoveImage(setUploadedBannerUrl, setBannerError)}
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
            </div>
          </div>

          <Button type="submit" className="w-full bg-red-500 hover:bg-red-400">
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}
