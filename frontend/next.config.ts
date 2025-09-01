// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["df-neyshabor.ir"], // فقط نام دامنه
  },
};

export default nextConfig;
