// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // فعال‌سازی حالت Strict برای شناسایی خطاها
  swcMinify: true,       // فعال‌سازی Minify با کامپایلر SWC
  images: {
    domains: ["example.com"], // دامنه‌های مجاز برای بارگذاری تصاویر
  },
  i18n: {
    locales: ["fa", "en"],
    defaultLocale: "fa",
  },
  compiler: {
    styledComponents: true, // اگر از styled-components استفاده می‌کنی
  },
  eslint: {
    ignoreDuringBuilds: true, // جلوگیری از توقف build به‌خاطر خطاهای ESLint
  },
  typescript: {
    ignoreBuildErrors: true, // جلوگیری از توقف build به‌خاطر خطاهای TypeScript
  },
 experimental: {
  serverActions: {
    bodySizeLimit: "2mb", // یا عدد مثل 2000000
    allowedOrigins: ["https://example.com", "https://yourdomain.ir"],
  },
}
};

export default nextConfig;
