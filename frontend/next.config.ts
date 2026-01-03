import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Set output to 'export' to generate the 'out' folder for GitHub Pages */
  output: 'export',
  
  /* Required for GitHub Pages as it doesn't support the Next.js Image Optimization API */
  images: {
    unoptimized: true,
  },

  /* Optional: If your repo name is 'my-portfolio', uncomment the lines below */
  // basePath: '/my-portfolio',
};

export default nextConfig;
