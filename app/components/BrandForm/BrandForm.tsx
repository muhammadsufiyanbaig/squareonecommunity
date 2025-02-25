"use client";

import { useState, useEffect } from "react";
import { CheckIcon, CircleX, Edit, Upload, X } from "lucide-react"; // Import the X icon
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
import { Brand, uploadToCloudinary, WorkingHours } from "@/lib/index";
import axiosInstance from "@/app/axiosInstanse";
import useAuthStore, { useBrandStore } from "@/lib/base";
import { usePathname, useRouter } from "next/navigation";
import Spinner from "../Spinner";
import { useToast } from "@/hooks/use-toast";

interface BrandFormProps {
  brandName?: string;
}

export default function BrandForm({
  brandName: initialBrandName,
}: BrandFormProps) {
  const [whatsAppNumber, setWhatsAppNumber] = useState<string>("+92-");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reqLoading, setReqLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = useAuthStore();
  const { brands, updateBrand, addBrand } = useBrandStore(); // Updated destructuring
  const brandName = initialBrandName || null;
  const [brand, setBrands] = useState<Brand | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);

  const [brandNameField, setBrandNameField] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([
    { day: "Monday", start: "", end: "", closes: false },
    { day: "Tuesday", start: "", end: "", closes: false },
    { day: "Wednesday", start: "", end: "", closes: false },
    { day: "Thursday", start: "", end: "", closes: false },
    { day: "Friday", start: "", end: "", closes: false },
    { day: "Saturday", start: "", end: "", closes: false },
    { day: "Sunday", start: "", end: "", closes: false },
  ]);

  const { toast } = useToast();

  const router = useRouter();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (brandName) {
      setFetching(true);
      const tempBrand = brands.find((brand) => brand.brandname === brandName);
      if (tempBrand) {
        setBrands(tempBrand);
        setBrandNameField(tempBrand.brandname);
        setUploadedUrl(tempBrand.logoimage);
        setWhatsAppNumber(tempBrand.brandwhatsappno);
        setDescription(tempBrand.description);
        setWorkingHours(tempBrand.workingHours || []);
        setCategory(tempBrand.category);
      }
      setFetching(false);
    }
  }, [brandName, brands]);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

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
      setErrors((prev) => ({ ...prev, logoImage: "" }));
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
      setErrors((prev) => ({ ...prev, logoImage: "" }));
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
    setErrors((prev) => ({ ...prev, whatsAppNumber: "" }));
  };

  const handleRemoveImage = () => {
    setUploadedUrl(null);
    setError(null);
  };

  const handleWorkingHoursChange = (
    index: number,
    field: keyof WorkingHours,
    value: string | boolean
  ) => {
    const newWorkingHours = [...workingHours];
    if (field === "closes" && value === true) {
      newWorkingHours[index].start = "";
      newWorkingHours[index].end = "";
    }
    newWorkingHours[index][field] = value as never;
    setWorkingHours(newWorkingHours);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!brandNameField) newErrors.brandName = "Brand name is required";
    if (!category) newErrors.category = "Category is required";
    if (!uploadedUrl) newErrors.logoImage = "Logo image is required";
    if (!whatsAppNumber || !/^\+92-\d{10}$/.test(whatsAppNumber))
      newErrors.whatsAppNumber = "Valid WhatsApp number is required";
    if (!description) newErrors.description = "Description is required";
    workingHours.forEach((day, index) => {
      if (!day.closes && (!day.start || !day.end)) {
        newErrors[`workingHours-${index}`] = "Start and end times are required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setReqLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    formData.set("logoImage", uploadedUrl || "");
    formData.set("createdBy", id);
    formData.set("workingHours", JSON.stringify(workingHours));

    if (brand) {
      formData.set("brandid", brand.brandid);
    }

    try {
      let response;
      if (brand) {
        response = await axiosInstance.put(`/brand/edit`, formData);
      } else {
        response = await axiosInstance.post("/brand/create", formData);
      }

      if (response.status === 200 || response.status === 201) {
        if (brand) {
          updateBrand(brand.brandid, {
            brandname: brandNameField,
            category,
            logoimage: uploadedUrl || "",
            brandwhatsappno: whatsAppNumber,
            description,
            workingHours,
          });
        } else {
          console.log(response)
          const newBrand = response.data.data || response.data;
          addBrand({
            brandid: newBrand.brandid,
            brandname: brandNameField,
            category,
            logoimage: uploadedUrl || "",
            createdby: id,
            createdat: new Date().toISOString(),
            brandwhatsappno: whatsAppNumber,
            description,
            workingHours,
            deals: []
          });
        }
        toast({
          title: brand ? "Updated" : "Created",
          description: (
            <div className="flex items-center">
              <span className="text-green-500 border border-green-500 rounded-full p-1 mr-2">
                <CheckIcon className="h-4 w-4" />
              </span>
              <span className="first-letter:capitalize">
                Brand {brand ? "updated" : "created"} successfully
              </span>
            </div>
          ),
        });
        router.push(`/brands/${brandNameField}`);
        // Clear form fields and images
        setBrandNameField("");
        setCategory("");
        setUploadedUrl(null);
        setWhatsAppNumber("+92-");
        setDescription("");
        setWorkingHours([
          { day: "Monday", start: "", end: "", closes: false },
          { day: "Tuesday", start: "", end: "", closes: false },
          { day: "Wednesday", start: "", end: "", closes: false },
          { day: "Thursday", start: "", end: "", closes: false },
          { day: "Friday", start: "", end: "", closes: false },
          { day: "Saturday", start: "", end: "", closes: false },
          { day: "Sunday", start: "", end: "", closes: false },
        ]);
      }
    } catch (error: any) {
      console.error("error:", error.response?.data || error.message);
      toast({
        title: "Somthing went wrong",
        description: (
          <div className="flex items-center">
            <CircleX className="h-4 w-4 text-red-500 mr-2" />
            <span className="first-letter:capitalize">{"An unexpected error occurred"}</span>
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
        (!brandName || brand) && (
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  name="brandName"
                  placeholder="Brand Name"
                  value={brandNameField}
                  onChange={handleInputChange(setBrandNameField, "brandName")}
                  className={errors.brandName ? "border-red-500" : ""}
                />
                {errors.brandName && (
                  <p className="text-red-500 text-sm">{errors.brandName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  name="category"
                  value={category || "Select a category"} // Set the value to the current category
                  onValueChange={(value) => {
                    setCategory(value);
                    setErrors((prev) => ({ ...prev, category: "" }));
                  }}
                >
                  <SelectTrigger
                    className={errors.category ? "border-red-500" : ""}
                  >
                    <SelectValue>{category || "Select a category"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-sm">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Logo Image</Label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className={`border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-colors ${
                    errors.logoImage
                      ? "border-red-500"
                      : "border-gray-300 hover:border-primary"
                  }`}
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
                {errors.logoImage && (
                  <p className="text-red-500 text-sm">{errors.logoImage}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandId">Brand What's App no</Label>
                <Input
                  id="brandId"
                  name="brandWhatsAppNo"
                  value={whatsAppNumber}
                  onChange={handleWhatsAppChange}
                  placeholder="+92-xxxxxxxxxx"
                  className={errors.whatsAppNumber ? "border-red-500" : ""}
                />
                {errors.whatsAppNumber && (
                  <p className="text-red-500 text-sm">{errors.whatsAppNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="placeholder"
                  name="description"
                  value={description}
                  onChange={handleInputChange(setDescription, "description")}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Working Hours</Label>
                {workingHours.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between space-x-2"
                  >
                    <span className="w-20">{day.day}</span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-col md:flex-row">
                        <Input
                          type="time"
                          value={day.start}
                          onChange={(e) =>
                            handleWorkingHoursChange(
                              index,
                              "start",
                              e.target.value
                            )
                          }
                          placeholder="Start"
                          readOnly={day.closes}
                          className={
                            errors[`workingHours-${index}`]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        <Input
                          type="time"
                          value={day.end}
                          onChange={(e) =>
                            handleWorkingHoursChange(index, "end", e.target.value)
                          }
                          placeholder="End"
                          readOnly={day.closes}
                          className={
                            errors[`workingHours-${index}`]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        <label className="flex items-center space-x-2">
                          <Input
                            type="checkbox"
                            checked={day.closes}
                            onChange={(e) =>
                              handleWorkingHoursChange(
                                index,
                                "closes",
                                e.target.checked
                              )
                            }
                          />
                          <span>Closed</span>
                        </label>
                      </div>
                      {errors[`workingHours-${index}`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`workingHours-${index}`]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
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
