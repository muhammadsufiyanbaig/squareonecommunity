"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CircleX, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import NextImage from "next/image";
import { Brand, Deal, uploadToCloudinary } from "@/lib/index";
import { usePathname, useRouter } from "next/navigation";
import { useBrandStore } from "@/lib/base";
import axiosInstance from "@/app/axiosInstanse";
import Spinner from "../Spinner";
import { useToast } from "@/hooks/use-toast";

interface DealFormProps {
  dealname?: string;
}

export default function DealForm({ dealname }: DealFormProps) {
  const [uploadedPictureUrl, setUploadedPictureUrl] = useState<string | null>(
    null
  );
  const [uploadedBannerUrl, setUploadedBannerUrl] = useState<string | null>(
    null
  );
  const [pictureLoading, setPictureLoading] = useState<boolean>(false);
  const [bannerLoading, setBannerLoading] = useState<boolean>(false);
  const [pictureError, setPictureError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [tempBrand, setTempBrand] = useState<Brand | null>(null);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [reqLoading, setReqLoading] = useState<boolean>(false);
  const { brands, setBrands, updateDeal, addDeal } = useBrandStore();
  const pathname = usePathname();
  const brandName = dealname ? pathname.split("/")[2] : pathname.split("/")[3];
  const router = useRouter()
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (brandName) {
      const brand = brands.find(
        (brand) => brand.brandname === decodeURIComponent(brandName)
      );
      if (brand) {
        setTempBrand(brand);
      }
    }
  }, [brandName, brands]);

  useEffect(() => {
    if (dealname && tempBrand) {
      const foundDeal = tempBrand?.deals.find(
        (deal) => deal.title === dealname
      );
      if (foundDeal) {
        setDeal(foundDeal);
        setTitle(foundDeal.title);
        setDescription(foundDeal.description);
        setTagline(foundDeal.tagline);
        setStartDate(foundDeal.startDate);
        setEndDate(foundDeal.endDate);
        setUploadedPictureUrl(foundDeal.Picture);
        setUploadedBannerUrl(foundDeal.Banner);
      }
    }
  }, [dealname, tempBrand]);

  const checkImageRatio = (file: File, expectedRatio: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        resolve(Math.abs(ratio - expectedRatio) < 0.01);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: (url: string | null) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void,
    expectedRatio: number
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setLoading(true);
      setError(null);
      const isValidRatio = await checkImageRatio(file, expectedRatio);
      if (!isValidRatio) {
        setError(`Image ratio should be ${expectedRatio === 1 ? "1:1" : "9:16"}.`);
        setLoading(false);
        return;
      }
      const url = await uploadToCloudinary(file);
      if (url) {
        setUrl(url);
      } else {
        setError("Failed to upload image. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    setUrl: (url: string | null) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void,
    expectedRatio: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setLoading(true);
      setError(null);
      const isValidRatio = await checkImageRatio(file, expectedRatio);
      if (!isValidRatio) {
        setError(`Image ratio should be ${expectedRatio === 1 ? "1:1" : "9:16"}.`);
        setLoading(false);
        return;
      }
      const url = await uploadToCloudinary(file);
      if (url) {
        setUrl(url);
      } else {
        setError("Failed to upload image. Please try again.");
      }
      setLoading(false);
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
    setReqLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = {
      brandId: tempBrand?.brandid,
      title: formData.get("title"),
      description: formData.get("description"),
      tagline: formData.get("tagline"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      picture: uploadedPictureUrl,
      banner: uploadedBannerUrl,
      createdAt: new Date().toISOString(),
    };

    try {
      let response;
      if (deal) {
        data.id = deal.dealid;
        data.brandId = tempBrand?.brandid;
        response = await axiosInstance.put("/deal/edit", data);
      } else {
        response = await axiosInstance.post("/deal/create", data);
        data.dealid = response.data.dealid; // Set the dealid for the new deal
      }

      if (response.status === 200 || response.status === 201) {
        toast({
          title: deal ? "Updated" : "Created",
          description: (
            <div className="flex items-center">
              <span className="text-green-500 border border-green-500 rounded-full p-1 mr-2">
                <CheckIcon className="h-4 w-4" />
              </span>
              <span className="first-letter:capitalize">
                Deal {deal ? "updated" : "created"} successfully
              </span>
            </div>
          ),
        });

        // Update the deal in useBrandStore
        if (deal) {
          updateDeal(tempBrand!.brandid, { ...data, dealid: data.id, });
        } else {
          addDeal(tempBrand!.brandid, { ...data, dealid: data.dealid });
        }

        router.push(`/brands/${decodeURIComponent(brandName)}/${data.title}`);
        // Clear form fields and images
        setTitle("");
        setDescription("");
        setTagline("");
        setStartDate("");
        setEndDate("");
        setUploadedPictureUrl(null);
        setUploadedBannerUrl(null);

      }
    } catch (error: any) {
      console.error("error:", error.response?.data || error.message);
      toast({
        title: "Somthing went wrong",
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
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Deal Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Deal Description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              name="tagline"
              placeholder="Tagline"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              required
              value={startDate.split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              required
              value={endDate.split("T")[0]}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Picture</Label>
            <div
              onDrop={(e) =>
                handleDrop(
                  e,
                  setUploadedPictureUrl,
                  setPictureLoading,
                  setPictureError,
                  1 // 1:1 ratio for picture
                )
              }
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-colors border-gray-300 hover:border-primary"
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="pictureUpload"
                name="picture"
                onChange={(e) =>
                  handleFileChange(
                    e,
                    setUploadedPictureUrl,
                    setPictureLoading,
                    setPictureError,
                    1 // 1:1 ratio for picture
                  )
                }
              />
              <label
                htmlFor="pictureUpload"
                className="flex flex-col items-center justify-center min-h-36"
              >
                {uploadedPictureUrl ? (
                  <div className="relative">
                    <NextImage
                      src={uploadedPictureUrl}
                      alt="Uploaded Picture"
                      height={1000}
                      width={1000}
                      className="h-full w-36 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveImage(
                          setUploadedPictureUrl,
                          setPictureError
                        )
                      }
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
            <div
              onDrop={(e) =>
                handleDrop(
                  e,
                  setUploadedBannerUrl,
                  setBannerLoading,
                  setBannerError,
                  9 / 16 // 9:16 ratio for banner
                )
              }
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-colors border-gray-300 hover:border-primary"
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
                    setBannerError,
                    9 / 16 // 9:16 ratio for banner
                  )
                }
              />
              <label
                htmlFor="bannerUpload"
                className="flex flex-col items-center justify-center min-h-36"
              >
                {uploadedBannerUrl ? (
                  <div className="relative">
                    <NextImage
                      src={uploadedBannerUrl}
                      alt="Uploaded Banner"
                      height={1000}
                      width={1000}
                      className="h-full w-36 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveImage(setUploadedBannerUrl, setBannerError)
                      }
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

          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-400 text-white"
          >
            {reqLoading ? <Spinner /> : "Submit"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
