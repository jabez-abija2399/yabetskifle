import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // Cache optimized images for 24 hours
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uypkccrufloxocjbzbaj.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
