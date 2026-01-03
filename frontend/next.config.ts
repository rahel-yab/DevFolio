import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // REPLACE 'DevFolio' with your actual repository name
  basePath: '/DevFolio', 
  // This ensures assets like CSS/JS are loaded from the correct subpath
  assetPrefix: '/DevFolio', 
};

export default nextConfig;
