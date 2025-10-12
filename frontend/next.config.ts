/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.df-neyshabor.ir",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
