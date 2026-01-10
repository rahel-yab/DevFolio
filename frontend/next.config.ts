import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/DevFolio',
  assetPrefix: '/DevFolio',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
