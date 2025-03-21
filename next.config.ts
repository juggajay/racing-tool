import { NextConfig } from 'next';

const config: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: false, // You can also change this to false to use Vercel's image optimization
  },
};

export default config;
