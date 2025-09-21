// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["df-neyshabor.ir"], // فقط نام دامنه
  },
  // این تنظیم برای ساخت یک سرور بهینه برای دیپلوی در نظر گرفته شده است.
  output: "standalone"
};

export default nextConfig;