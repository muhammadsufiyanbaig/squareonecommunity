import axiosInstance from "@/app/axiosInstanse";
import axios from "axios";

export interface code {
  code: string;
  fullName: string;
  whatsAppNo: string;
  profileImage: string;
};

export type Deal = {
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
};

export type Brand = {
  brandid: string;
  brandname: string;
  category: string;
  logoimage: string;
  createdby: string;
  createdat: string;
  brandwhatsappno: string;
  description: string;
  workinghours: string;
  deals: Deal[];
};

export type Events = {
  title: string;
  description: string;
  background: string;
  banner: string;
  brandWhatsappNo: string;
  dates: {
    start: string;
    end: string;
  };
  activities: string[]; // Array of activities
};

export let brands: Brand[] = [];

export const findDeal = (brandname: string, dealCode: string) => {
  const brand = brands.find((b) => b.brandname === brandname);
  if (!brand) return null;
  return brand.deals.find((d) => d.code?.some(c => c.code === dealCode));
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

export const events: Events[] = [
  {
    title: "Tech Expo 2024",
    description:
      "Join us for the annual Tech Expo showcasing the latest in technology.",
    background: "/chanel-banner.webp",
    banner: "/chanel-banner.webp",
    brandWhatsappNo: "+1234567890",
    dates: {
      start: "2024-11-01",
      end: "2024-11-03",
    },
    activities: [
      "/chanel-banner.webp",
      "/chanel-banner.webp",
      "/chanel-banner.webp",
    ],
  },
  {
    title: "Gadget Fest",
    description: "A festival celebrating the coolest gadgets and gizmos.",
    background: "/chanel-banner.webp",
    banner: "/chanel-banner.webp",
    brandWhatsappNo: "+1234567890",
    dates: {
      start: "2024-12-15",
      end: "2024-12-17",
    },
    activities: [
      "/chanel-banner.webp",
      "/chanel-banner.webp",
      "/chanel-banner.webp",
      "/chanel-banner.webp",
    ],
  },
  {
    title: "Gadget Fest",
    description: "A festival celebrating the coolest gadgets and gizmos.",
    background: "/chanel-banner.webp",
    banner: "/chanel-banner.webp",
    brandWhatsappNo: "+1234567890",
    dates: {
      start: "2024-12-15",
      end: "2024-12-17",
    },
    activities: [
      "/chanel-banner.webp",
      "/chanel-banner.webp",
      "/chanel-banner.webp",
      "/chanel-banner.webp",
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
