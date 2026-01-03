import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // This is the critical fix for https://rahel-yab.github.io/DevFolio/
  basePath: '/DevFolio',
};

export default nextConfig;
