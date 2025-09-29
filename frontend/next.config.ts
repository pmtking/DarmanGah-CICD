import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // همه دامنه‌های مورد نیاز (پروداکشن + لوکال)
    domains: [
      "localhost",        // برای توسعه لوکال
      "df-neyshabor.ir",  // دامین اول پروداکشن
      "drfn.ir"          // دامین دوم پروداکشن
    ],
  },
  output: "standalone", // برای دیپلوی
};

export default nextConfig;
