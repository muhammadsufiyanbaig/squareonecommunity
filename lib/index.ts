import axiosInstance from "@/app/axiosInstanse";
import axios from "axios";

export interface code {
  code: string;
  fullName: string;
  whatsAppNo: string;
  profileImage: string;
}

export interface Deal {
  type: string;
  Banner: string;
  Picture: string;
  createdAt: string;
  dealid: string;
  description: string;
  endDate: string;
  startDate: string;
  tagline: string;
  title: string;
  code: code[] | null;
}

export interface WorkingHours {
  day: string;
  start: string;
  end: string;
  closes: boolean;
}

export interface Brand {
  brandid: string;
  brandname: string;
  category: string;
  logoimage: string;
  createdby: string;
  createdat: string;
  brandwhatsappno: string;
  description: string;
  workinghours: WorkingHours[];
  deals: Deal[];
}

export interface Events {
  id: string;
  title: string;
  description: string;
  background: string;
  banner: string;
  start_date: string;
  end_date: string;
  activities: string[];
  liked: string;
  going: string;
}

export interface Ad {
  id: string;
  banner: string;
  brandid: string;
  createdby: string;
  dealid: string;
  startat: string;
  endat: string;
}

export let brands: Brand[] = [];
export let events: Events[] = [];

export const findDeal = (
  array: Brand[],
  brandname: string,
  dealTitle: string
) => {
  const brand = array.find((b) => b.brandname === brandname);
  if (!brand) return null;
  const deal = brand.deals.find((d) => d.title === dealTitle);
  return deal;
};

export const findEvent = (eventTitle: string) => {
  return events.find((e) => e.title === eventTitle);
};

export type User = {
  userId: string;
  name: string;
  whatAppNo: string;
  selectedDeals: {
    dealTitle: string;
    dealCode: string;
  }[];
};

export const users: User[] = [
  {
    userId: "user1",
    name: "John Doe",
    whatAppNo: "+1234567890",
    selectedDeals: [
      { dealTitle: "Buy One Get One Free", dealCode: "BOGO123" },
      { dealTitle: "Free Shipping Over $50", dealCode: "FREESHIP" },
    ],
  },
  {
    userId: "user2",
    name: "Jane Smith",
    whatAppNo: "+1234567890",
    selectedDeals: [
      { dealTitle: "20% Off on First Purchase", dealCode: "FIRST20" },
    ],
  },
];

export const uploadToCloudinary = async (
  file: File
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
  );
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error: any) {
    console.error(
      "Cloudinary Upload Error:",
      error.response ? error.response.data : error
    );
    return null;
  }
};

export const getBrands = async () => {
  try {
    const response = await axiosInstance.get("/brand/admin/all/get");
    if (response.status === 200 || response.status === 201) {
      brands = response.data.data;
      return brands;
    }
  } catch (error) {
    return null;
  }
};

export const getEvents = async () => {
  try {
    const response = await axiosInstance.get("/event/admin/get");
    if (response.status === 200 || response.status === 201) {
      events = response.data.data;
      return events;
    }
  } catch (error) {
    return null;
  }
};
