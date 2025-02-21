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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const { toast } = useToast();
  const [discount, setDiscount] = useState<number | null>(null);
  const [discountType, setDiscountType] = useState<string>("Upto"); // Add state for discount type
  const [type, setType] = useState<string>("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [taglineError, setTaglineError] = useState<string | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);
  const [fetching, setFetching] = useState<boolean>(false); // Add fetching state

  useEffect(() => {
    if (brandName) {
      setFetching(true); // Set fetching to true
      const brand = brands.find(
        (brand) => brand.brandname === decodeURIComponent(brandName)
      );
      if (brand) {
        setTempBrand(brand);
      }
      setFetching(false); // Set fetching to false
    }
  }, [brandName, brands]);

  useEffect(() => {
    if (dealname && tempBrand) {
      setFetching(true); // Set fetching to true
      const foundDeal = tempBrand?.deals.find(
        (deal) => deal.title === dealname
      );
      if (foundDeal) {
        setType(foundDeal.type);
        setDeal(foundDeal);
        setTitle(foundDeal.title);
        setDescription(foundDeal.description);
        setTagline(foundDeal.tagline);
        setStartDate(foundDeal.startDate);
        setEndDate(foundDeal.endDate);
        setUploadedPictureUrl(foundDeal.Picture);
        setUploadedBannerUrl(foundDeal.Banner);
      }
      setFetching(false); // Set fetching to false
    }
  }, [dealname, tempBrand]);

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

  const handleInputChange =
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      setError: React.Dispatch<React.SetStateAction<string | null>>
    ) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
      setError(null);
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
        setError(
          `Image ratio should be ${expectedRatio === 1 ? "1:1" : "9:16"}.`
        );
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
        setError(
          `Image ratio should be ${expectedRatio === 1 ? "1:1" : "9:16"}.`
        );
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

    // Reset errors
    setTitleError(null);
    setDescriptionError(null);
    setTaglineError(null);
    setDiscountError(null);
    setStartDateError(null);
    setEndDateError(null);
    setPictureError(null);
    setBannerError(null);
    setTypeError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = {
      brandId: tempBrand?.brandid,
      title: formData.get("title"),
      description: formData.get("description"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      Picture: uploadedPictureUrl,
      Banner: uploadedBannerUrl,
      createdAt: new Date().toISOString(),
      type: type.toLowerCase(),
    };

    // Validation
    let hasError = false;
    if (!type) {
      setTypeError("Type is required");
      hasError = true;
    }
    if (!data.title) {
      setTitleError("Title is required");
      hasError = true;
    }
    if (!data.description) {
      setDescriptionError("Description is required");
      hasError = true;
    }
    if (type === "deal" && !tagline) {
      setTaglineError("Tagline is required");
      hasError = true;
    }
    if (
      type === "discount" &&
      (!tagline || Number(tagline) < 1 || Number(tagline) > 100)
    ) {
      setDiscountError("Discount must be between 1 and 100");
      hasError = true;
    }
    if (!data.startDate) {
      setStartDateError("Start date is required");
      hasError = true;
    }
    if (!data.endDate) {
      setEndDateError("End date is required");
      hasError = true;
    }
    if (!uploadedPictureUrl) {
      setPictureError("Picture is required");
      hasError = true;
    }
    if (!uploadedBannerUrl) {
      setBannerError("Banner is required");
      hasError = true;
    }

    if (hasError) {
      setReqLoading(false);
      return;
    }

    // Set the correct tagline based on the type
    if (type === "deal") {
      data.tagline = tagline;
    } else if (type === "discount") {
      data.tagline = `${discountType} ${tagline}% off`;
    }

    try {
      let response;
      if (deal) {
        data.dealid = deal.dealid;
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
          updateDeal(tempBrand!.brandid, { ...data, dealid: deal.dealid });
        } else {
          addDeal(tempBrand!.brandid, { ...data, dealid: data });
        }

        router.push(`/brands/${decodeURIComponent(brandName)}/${encodeURIComponent(data.title)}`);
        // Clear form fields and images
        setTitle("");
        setDescription("");
        setTagline("");
        setDiscount(null);
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
      {fetching ? (
        <div className="flex justify-center items-center h-64">
          <Spinner /> {/* Add Spinner component for loading */}
        </div>
      ) : (
        (!dealname || deal) && (
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  name="type"
                  value={type}
                  onValueChange={(value) => {
                    setType(value);
                    setTagline("");
                    setDiscount(null);
                  }}
                >
                  <SelectTrigger
                    className={`w-[180px] ${typeError ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select a type">
                      {type || (
                        <span className="text-gray-400">Select a type</span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deal">Deal</SelectItem>
                    <SelectItem value="discount">Discount</SelectItem>
                  </SelectContent>
                </Select>
                {typeError && (
                  <p className="text-red-500 text-sm">{typeError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Deal Title"
                  value={title}
                  onChange={handleInputChange(setTitle, setTitleError)}
                  className={titleError ? "border-red-500" : ""}
                />
                {titleError && (
                  <p className="text-red-500 text-sm">{titleError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Deal Description"
                  value={description}
                  onChange={handleInputChange(
                    setDescription,
                    setDescriptionError
                  )}
                  className={descriptionError ? "border-red-500" : ""}
                />
                {descriptionError && (
                  <p className="text-red-500 text-sm">{descriptionError}</p>
                )}
              </div>

              {type === "deal" ? (
                <div className="space-y-2 relative">
                  <Label htmlFor="tagline">Deal Tagline</Label>
                  <Input
                    id="tagline"
                    name="tagline"
                    placeholder="Tagline"
                    maxLength={25}
                    value={tagline}
                    onChange={handleInputChange(setTagline, setTaglineError)}
                    className={taglineError ? "border-red-500" : ""}
                  />
                  {taglineError && (
                    <p className="text-red-500 text-sm">{taglineError}</p>
                  )}
                  <p className="absolute bottom-2 right-2 text-sm text-gray-500">
                    {tagline.length}/25
                  </p>
                </div>
              ) : type === "discount" ? (
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                    <div className="flex space-x-2">
                    <Select
                      name="discountType"
                      value={discountType}
                      onValueChange={(value) => setDiscountType(value)}
                    >
                      <SelectTrigger className="w-[100px]">
                      <SelectValue>{discountType}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="Upto">Upto</SelectItem>
                      <SelectItem value="Flat">Flat</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="discount"
                      name="tagline"
                      type="number"
                      placeholder="Discount Percentage"
                      min={1}
                      max={100}
                      value={tagline ? tagline.split(" ")[1]?.split("%")[0] || tagline : tagline}
                      onChange={(e) => {
                      const value = Math.min(Number(e.target.value.slice(0, 3)), 100);
                      setTagline(value.toString());
                      setDiscountError(null);
                      }}
                      className={discountError ? "border-red-500" : ""}
                    />
                    </div>
                  {discountError && (
                    <p className="text-red-500 text-sm">{discountError}</p>
                  )}
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={startDate.split("T")[0]}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setStartDateError(null);
                  }}
                  className={startDateError ? "border-red-500" : ""}
                />
                {startDateError && (
                  <p className="text-red-500 text-sm">{startDateError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={endDate.split("T")[0]}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setEndDateError(null);
                  }}
                  className={endDateError ? "border-red-500" : ""}
                />
                {endDateError && (
                  <p className="text-red-500 text-sm">{endDateError}</p>
                )}
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
                  className={`border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-colors ${
                    pictureError
                      ? "border-red-500"
                      : "border-gray-300 hover:border-primary"
                  }`}
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
                      9 / 16
                    )
                  }
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={`border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-colors ${
                    bannerError
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
                            handleRemoveImage(
                              setUploadedBannerUrl,
                              setBannerError
                            )
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
        )
      )}
    </div>
  );
}
