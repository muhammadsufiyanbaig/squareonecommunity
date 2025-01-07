"use client";

import axiosInstance from "@/app/axiosInstanse";
import Spinner from "@/app/components/Spinner";
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
import { useToast } from "@/hooks/use-toast";
import { Deal, uploadToCloudinary } from "@/lib";
import useAuthStore, { useBrandStore, useAdStore } from "@/lib/base";
import { CheckIcon, CircleX, Upload, X } from "lucide-react";
import NextImage from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdFormProps {
  AdId?: string;
}

const checkImageRatio = (
  file: File,
  expectedRatio: number
): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      resolve(Math.abs(ratio - expectedRatio) < 0.01);
    };
    img.src = URL.createObjectURL(file);
  });
};

const AdForm = ({ AdId }: AdFormProps) => {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reqLoading, setReqLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { brands } = useBrandStore();
  const { id } = useAuthStore();
  const { getAdById } = useAdStore();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [brandError, setBrandError] = useState<string | null>(null);
  const [dealError, setDealError] = useState<string | null>(null);
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const router = useRouter();

  console.log(AdId)

  useEffect(() => {
    if (selectedBrand) {
      const brand = brands.find((brand) => brand.brandid === selectedBrand);
      if (brand) {
        const normalizedDeals: Deal[] = Array.isArray(brand.deals)
          ? brand.deals
          : brand.deals
          ? [brand.deals]
          : [];

        const validDeals = normalizedDeals.filter(
          (deal) =>
            deal.title &&
            deal.tagline &&
            deal.startDate &&
            deal.endDate &&
            deal.createdAt
        );
        setDeals(validDeals);
      } else {
        setDeals([]);
      }
    } else {
      setDeals([]);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (AdId) {
      setDataLoading(true);
      const ad = getAdById(AdId);
      if (ad) {
        setUploadedUrl(ad.banner);
        setSelectedBrand(ad.brandid);
        setSelectedDeal(ad.dealid);
        setStartDate(ad.startat.split('T')[0]); // Ensure date format is correct
        setEndDate(ad.endat.split('T')[0]); // Ensure date format is correct

        // Fetch and set brand and deal
        const brand = brands.find((brand) => brand.brandid === ad.brandid);
        if (brand) {
          setSelectedBrand(brand.brandid);
          const deal = brand.deals.find((deal) => deal.dealid === ad.dealid);
          if (deal) {
            setSelectedDeal(deal.dealid);
          }
        }
      }
      setDataLoading(false);
      console.log(ad);
    } else {
      setDataLoading(false); // Ensure dataLoading is false when adding a new ad
    }
  }, [AdId, getAdById, brands]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const isValidRatio = await checkImageRatio(file, 16 / 9);
      if (!isValidRatio) {
        setError("Image must have a 16:9 aspect ratio.");
        return;
      }
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
      const isValidRatio = await checkImageRatio(file, 16 / 9);
      if (!isValidRatio) {
        setError("Image must have a 16:9 aspect ratio.");
        return;
      }
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveImage = () => {
    setUploadedUrl(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReqLoading(true);
    setFormSubmitted(true);

    // Reset errors
    setBrandError(null);
    setDealError(null);
    setStartDateError(null);
    setEndDateError(null);
    setError(null);

    const data: any = {
      banner: uploadedUrl || "",
      createdBy: id,
      brandId: selectedBrand,
      dealId: selectedDeal,
      startAt: startDate,
      endAt: endDate,
    };

    // Validation
    let hasError = false;
    if (!data.brandId) {
      setBrandError("Brand is required");
      hasError = true;
    }
    if (!data.dealId) {
      setDealError("Deal is required");
      hasError = true;
    }
    if (!data.startAt) {
      setStartDateError("Start date is required");
      hasError = true;
    }
    if (!data.endAt) {
      setEndDateError("End date is required");
      hasError = true;
    }
    if (!data.banner) {
      setError("Banner image is required");
      hasError = true;
    }

    if (hasError) {
      setReqLoading(false);
      return;
    }

    try {
      let response;
      if (AdId) {
        data.id = AdId;
        response = await axiosInstance.put(`/ad/edit`, data);
      } else {
        response = await axiosInstance.post("/ad/create", data);
      }
      console.log("Response:", response.data);
      if (response.status === 200 || response.status === 201) {
        toast({
          title: `Ad ${AdId ? "updated" : "created"} successfully`,
          description: (
            <div className="flex items-center">
              <span className="text-green-500 border border-green-500 rounded-full p-1 mr-2">
                <CheckIcon className="h-4 w-4" />
              </span>
              <span className="first-letter:capitalize">Ad {AdId ? "updated" : "created"} successfully</span>
            </div>
          ),
        });

        // Clear form fields
        setUploadedUrl(null);
        setSelectedBrand(null);
        setDeals([]);
        setStartDate(null);
        setEndDate(null);
        setSelectedDeal(null);

        // Navigate to /ads
        router.push("/ads");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Something went wrong",
        description: (
          <div className="flex items-center">
            <CircleX className="h-4 w-4 text-red-500 mr-2" />
            <span className="first-letter:capitalize">{error}</span>
          </div>
        ),
      });
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <div className="p-4 dark:text-white">
      {dataLoading ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Logo Image</Label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-colors ${
                formSubmitted && error
                  ? "border-red-500"
                  : "border-gray-300 hover:border-primary"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="bannerUpload"
                name="bannerImage"
                onChange={handleFileChange}
              />
              <label
                htmlFor="bannerUpload"
                className="flex flex-col items-center justify-center min-h-36"
              >
                {uploadedUrl ? (
                  <div className="relative">
                    <NextImage
                      src={uploadedUrl}
                      alt="Uploaded Logo"
                      height={1000}
                      width={1000}
                      className="h-full w-60 object-cover rounded-lg border"
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
                      Drag & drop your banner here, or click to select
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="mt-6">
            <div className="space-y-2">
              <Label htmlFor="brands">Brands</Label>
              <Select
                name="brands"
                required
                defaultValue=""
                value={selectedBrand || ""}
                onValueChange={(value) => setSelectedBrand(value)}
              >
                <SelectTrigger
                  className={formSubmitted && brandError ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select brands">
                    {selectedBrand
                      ? brands.find((brand) => brand.brandid === selectedBrand)
                          ?.brandname
                      : "Select brands"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.brandid} value={brand.brandid}>
                      <div className="flex items-center gap-2">
                        <div className="h-8 aspect-square rounded-full overflow-hidden">
                          <NextImage
                            src={brand.logoimage}
                            alt={brand.brandname}
                            height={1000}
                            width={1000}
                            className="mr-2 h-full w-full object-cover object-center"
                          />
                        </div>
                        <span>{brand.brandname}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formSubmitted && brandError && (
                <p className="text-red-500 text-sm">{brandError}</p>
              )}
            </div>
          </div>

          {selectedBrand && (
            <div className="mt-6">
              <div className="space-y-2">
                <Label htmlFor="deals">Deal</Label>
                <Select
                  name="deal"
                  required
                  defaultValue=""
                  value={selectedDeal || ""}
                  onValueChange={(value) => setSelectedDeal(value)}
                >
                  <SelectTrigger
                    className={formSubmitted && dealError ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select deal">
                      {selectedDeal
                        ? deals.find((deal) => deal.dealid === selectedDeal)
                            ?.title
                        : "Select deal"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {deals.length > 0 ? (
                    deals.map((deal) => (
                      <SelectItem key={deal.dealid} value={deal.dealid}>
                        <div className="flex items-center gap-2">
                          <div className="h-8 aspect-square rounded-full overflow-hidden">
                            <NextImage
                              src={deal.Picture}
                              alt={deal.title}
                              height={1000}
                              width={1000}
                              className="mr-2 h-full w-full object-cover object-center"
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
              {formSubmitted && dealError && (
                <p className="text-red-500 text-sm">{dealError}</p>
              )}
            </div>
            </div>
          )}

          {selectedBrand && deals.length > 0 && (
            <div className="mt-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={startDate || ""}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`border rounded p-2 w-full ${
                    formSubmitted && startDateError ? "border-red-500" : ""
                  }`}
                />
                {formSubmitted && startDateError && (
                  <p className="text-red-500 text-sm">{startDateError}</p>
                )}
              </div>
            </div>
          )}

          {selectedBrand && deals.length > 0 && (
            <div className="mt-6">
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={endDate || ""}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`border rounded p-2 w-full ${
                    formSubmitted && endDateError ? "border-red-500" : ""
                  }`}
                />
                {formSubmitted && endDateError && (
                  <p className="text-red-500 text-sm">{endDateError}</p>
                )}
              </div>
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-400 text-white mt-6 disabled:cursor-not-allowed"
            disabled={
              !uploadedUrl ||
              !selectedBrand ||
              !selectedDeal ||
              !startDate ||
              !endDate
            }
          >
            {reqLoading ? <Spinner /> : "Submit"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default AdForm;
