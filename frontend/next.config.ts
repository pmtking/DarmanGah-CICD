import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // اجازه بارگذاری تصاویر از دامنه‌های مشخص
  images: {
    domains: [
      "localhost",         // توسعه لوکال
      "api.df-neyshabor.ir"// پروداکشن
              // پروداکشن
    ],
  },

  output: "standalone", // مناسب برای دیپلوی

  // فعال کردن middleware و edge runtime
  experimental: {
    middlewarePrefetch: "flexible", // prefetch برای middleware
  },

  // در صورت نیاز به basePath یا rewrites می‌توانید اینجا اضافه کنید
};

export default nextConfig;
