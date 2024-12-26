import axios from "axios";

export type Deal = {
  title: string;
  description: string;
  tagline: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  picture: string;
  code: string; 
  purchasedBy: string[]; // Array of user IDs who purchased the deal
};

export type Brand = {
  brandName: string;
  category: string;
  logoImage: string;
  banner: string;
  brandWhatsappNo: string;
  description: string;
  workingHours: {
    start: string;
    end: string;
  };
  deals: Deal[]; // Array of deals
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


export const brands: Brand[] = [
  {
    brandName: "TechGadgets",
    category: "Electronics",
    logoImage: "/chanel.jpg",
    banner: "/chanel-banner.webp",
    brandWhatsappNo: "+1234567890",
    description: "Your one-stop shop for the latest tech gadgets and accessories.",
    workingHours: {
      start: "09:00",
      end: "21:00",
    },
    deals: [
      {
        title: "Buy One Get One Free",
        description: "Enjoy our exclusive offer on select items.",
        tagline: "Limited-time deal!",
        startDate: "2024-12-01",
        endDate: "2024-12-10",
        createdAt: "2024-11-30",
        picture: "/deal.webp",
        code: "BOGO123",
        purchasedBy: ["user1", "user2"], // Example data
      },
      {
        title: "20% Off on First Purchase",
        description: "Sign up today and get 20% off your first purchase with us.",
        tagline: "Welcome to savings!",
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        createdAt: "2024-11-30",
        picture: "/deals/20off.jpg",
        code: "FIRST20",
        purchasedBy: ["user2"], // Example data
      },
      {
        title: "Free Shipping Over $50",
        description: "Get free shipping on all orders above $50.",
        tagline: "Shop more, save more!",
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        createdAt: "2024-11-30",
        picture: "/deals/freeshipping.jpg",
        code: "FREESHIP",
        purchasedBy: ["user1"], // Example data
      },
    ],
  },
  {
    brandName: "TechGadgets",
    category: "Electronics",
    logoImage: "/chanel.jpg",
    banner: "/chanel-banner.webp",
    brandWhatsappNo: "+1234567890",
    description: "Your one-stop shop for the latest tech gadgets and accessories.",
    workingHours: {
      start: "09:00",
      end: "21:00",
    },
    deals: [
      {
        title: "Buy One Get One Free",
        description: "Enjoy our exclusive offer on select items.",
        tagline: "Limited-time deal!",
        startDate: "2024-12-01",
        endDate: "2024-12-10",
        createdAt: "2024-11-30",
        picture: "/deals/bogo.jpg",
        code: "BOGO123",
        purchasedBy: ["user1", "user2"], // Example data
      },
      {
        title: "20% Off on First Purchase",
        description: "Sign up today and get 20% off your first purchase with us.",
        tagline: "Welcome to savings!",
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        createdAt: "2024-11-30",
        picture: "/deals/20off.jpg",
        code: "FIRST20",
        purchasedBy: ["user2"], // Example data
      },
      {
        title: "Free Shipping Over $50",
        description: "Get free shipping on all orders above $50.",
        tagline: "Shop more, save more!",
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        createdAt: "2024-11-30",
        picture: "/deals/freeshipping.jpg",
        code: "FREESHIP",
        purchasedBy: ["user1"], // Example data
      },
    ],
  },
  {
    brandName: "TechGadgets",
    category: "Electronics",
    logoImage: "/chanel.jpg",
    banner: "/chanel-banner.webp",
    brandWhatsappNo: "+1234567890",
    description: "Your one-stop shop for the latest tech gadgets and accessories.",
    workingHours: {
      start: "09:00",
      end: "21:00",
    },
    deals: [
      {
        title: "Buy One Get One Free",
        description: "Enjoy our exclusive offer on select items.",
        tagline: "Limited-time deal!",
        startDate: "2024-12-01",
        endDate: "2024-12-10",
        createdAt: "2024-11-30",
        picture: "/deals/bogo.jpg",
        code: "BOGO123",
        purchasedBy: ["user1", "user2"], // Example data
      },
      {
        title: "20% Off on First Purchase",
        description: "Sign up today and get 20% off your first purchase with us.",
        tagline: "Welcome to savings!",
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        createdAt: "2024-11-30",
        picture: "/deals/20off.jpg",
        code: "FIRST20",
        purchasedBy: ["user2"], // Example data
      },
      {
        title: "Free Shipping Over $50",
        description: "Get free shipping on all orders above $50.",
        tagline: "Shop more, save more!",
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        createdAt: "2024-11-30",
        picture: "/deals/freeshipping.jpg",
        code: "FREESHIP",
        purchasedBy: ["user1"], // Example data
      },
    ],
  },
];

export const findDeal = (brandName: string, dealCode: string) => {
  const brand = brands.find(b => b.brandName === brandName);
  if (!brand) return null;
  return brand.deals.find(d => d.code === dealCode);
};

export const findEvent = (eventTitle: string) => {
  return events.find(e => e.title === eventTitle);
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
    whatAppNo: '+1234567890',
    selectedDeals: [
      { dealTitle: "Buy One Get One Free", dealCode: "BOGO123" },
      { dealTitle: "Free Shipping Over $50", dealCode: "FREESHIP" },
    ],
  },
  {
    userId: "user2",
    name: "Jane Smith",
    whatAppNo: '+1234567890',
    selectedDeals: [
      { dealTitle: "20% Off on First Purchase", dealCode: "FIRST20" },
    ],
  },
];

export const events: Events[] = [
  {
    title: "Tech Expo 2024",
    description: "Join us for the annual Tech Expo showcasing the latest in technology.",
    background: "/chanel-banner.webp",
    banner: "/chanel-banner.webp",
    brandWhatsappNo: "+1234567890",
    dates: {
      start: "2024-11-01",
      end: "2024-11-03",
    },
    activities: ["/chanel-banner.webp", "/chanel-banner.webp", "/chanel-banner.webp"],
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
    activities: ["/chanel-banner.webp", "/chanel-banner.webp", "/chanel-banner.webp", "/chanel-banner.webp"],
  },
];

export const uploadToCloudinary = async (file: File): Promise<string | null> => {
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
