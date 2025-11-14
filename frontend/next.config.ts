/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: isDev, // فقط در production فعال باشه
  register: true,
  skipWaiting: true,
});

const nextConfig = withPWA({
  reactStrictMode: true,
  compress: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.df-neyshabor.ir",
        pathname: "/**",
      },
    ],
  },
});

module.exports = nextConfig;
