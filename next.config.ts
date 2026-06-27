import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    // Use modern AVIF + WebP formats for better compression
    formats: ["image/avif", "image/webp"],
  },
  // Enable React compiler optimizations (partial pre-rendering is auto in Next 16)
  experimental: {
    // Optimize package imports — reduces bundle size for icon-heavy packages
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
