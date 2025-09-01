// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["http://df-neyshabor.ir/"],
  },
};

export default nextConfig;
