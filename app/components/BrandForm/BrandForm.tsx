"use client";

import { useState, useEffect } from "react";
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
import { Brand, uploadToCloudinary } from "@/lib/index"; 
import axiosInstance from "@/app/axiosInstanse";
import useAuthStore, { useBrandStore } from "@/lib/base";
import { usePathname } from "next/navigation";
import Spinner from "../Spinner";

interface BrandFormProps {
  brandName?: string;
}

export default function BrandForm({ brandName: initialBrandName }: BrandFormProps) {
  const [whatsAppNumber, setWhatsAppNumber] = useState<string>("+92-");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reqLoading, setReqLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = useAuthStore();
  const brandName = initialBrandName || null;
  const [brand, setBrands] = useState<Brand | null>(null);

  const [brandNameField, setBrandNameField] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [workingHours, setWorkingHours] = useState<string>("");

  const { brands } = useBrandStore();

  useEffect(() => {
    if (brandName) {
      const tempBrand = brands.find((brand) => brand.brandname === brandName);
      if (tempBrand) {
        setBrands(tempBrand);
        setBrandNameField(tempBrand.brandname);
        setCategory(tempBrand.category);
        setUploadedUrl(tempBrand.logoimage);
        setWhatsAppNumber(tempBrand.brandwhatsappno);
        setDescription(tempBrand.description);
        setWorkingHours(tempBrand.workinghours);
      }
    }
  }, [brandName, brands]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setLoading(true);
      setError(null);
      const url = await uploadToCloudinary(file);
      if (url) {
        setUploadedUrl(url);
        console.log("Uploaded URL:", url);
      } else {
        setError("Failed to upload image. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setLoading(true);
      setError(null);
      const url = await uploadToCloudinary(file); // Use the reusable function
      if (url) {
        setUploadedUrl(url);
        console.log("Uploaded URL:", url);
      } else {
        setError("Failed to upload image. Please try again.");
      }
      setLoading(false);
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
    setReqLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    formData.set("logoImage", uploadedUrl || "");
    formData.set("createdBy", id);

    if (brand) {
      formData.set("id", brand.brandid);
    }

    try {
      let response;
      if (brand) {
        response = await axiosInstance.put(`/brand/edit`, formData);
      } else {
        response = await axiosInstance.post("/brand/create", formData);
        console.log(formData)
      }

      if (response.status === 200 || response.status === 201) {
        alert(`Brand ${brand ? "updated" : "created"} successfully`);
      } 
    } catch (error: any) {
      console.error("error:", error.response?.data || error.message);
      alert(error);
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input
              id="brandName"
              name="brandName"
              placeholder="Brand Name"
              required
              value={brandNameField}
              onChange={(e) => setBrandNameField(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              name="category"
              required
              value={category}
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category">{category}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
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
                className="flex flex-col items-center justify-center min-h-36"
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
            <Textarea
              id="description"
              placeholder="placeholder"
              name="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workingHours">Working Hours</Label>
            <Input
              id="workingHours"
              name="workingHours"
              required
              placeholder="e.g. 9:00 AM - 5:00 PM"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full bg-red-500 hover:bg-red-400 text-white">
            {reqLoading ? (<Spinner />) : "Submit"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
