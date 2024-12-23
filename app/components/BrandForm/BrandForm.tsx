"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react"; // Import the X icon
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import axios from "axios";

export default function BrandForm() {
  const [whatsAppNumber, setWhatsAppNumber] = useState<string>("+92-");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );
    try {
        setUploadedUrl(null);
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setUploadedUrl(response.data.secure_url);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      uploadToCloudinary(file); // Upload the file immediately
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      uploadToCloudinary(file); // Upload the file immediately
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\+92-\d*$/.test(value)) {
      setWhatsAppNumber(value.slice(0, 14));
    }
  };

  const handleRemoveImage = () => {
    setUploadedUrl(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      brandName: formData.get("brandName"),
      category: formData.get("category"),
      logoImage: uploadedUrl,
      brandWhatsAppNo: formData.get("brandWhatsAppNo"),
      description: formData.get("description"),
      workingHours: formData.get("workingHours"),
      createdBy: new Date().toISOString(),
    };
    console.log(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input id="brandName" name="brandName" placeholder="Brand Name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Logo Image</Label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-colors border-gray-300 hover:border-primary"
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="logoUpload"
                name="logoImage"
                onChange={handleFileChange}
              />
              <label
                htmlFor="logoUpload"
                className="flex flex-col items-center justify-center h-36"
              >
                {uploadedUrl ? (
                  <div className="relative">
                    <Image
                      src={uploadedUrl}
                      alt="Uploaded Logo"
                      height={1000}
                      width={1000}
                      className="h-full w-36 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0 p-1 bg-white rounded-full"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ) : loading ? (
                  <p className="text-lg text-gray-500">Uploading...</p>
                ) : error ? (
                  <p className="text-sm text-red-500">{error}</p>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drag & drop your logo here, or click to select
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandId">Brand What's App no</Label>
            <Input
              id="brandId"
              name="brandWhatsAppNo"
              required
              value={whatsAppNumber}
              onChange={handleWhatsAppChange}
              placeholder="+92-xxxxxxxxxx"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="placeholder" name="description" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workingHours">Working Hours</Label>
            <Input
              id="workingHours"
              name="workingHours"
              required
              placeholder="e.g. 9:00 AM - 5:00 PM"
            />
          </div>

          <Button type="submit" className="w-full bg-red-500 hover:bg-red-400">
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
}
