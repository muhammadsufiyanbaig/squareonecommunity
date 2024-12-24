import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_CLOUDINARY_HOSTNAME || 'res.cloudinary.com',        
      },
    ],
  },
};

export default nextConfig;
