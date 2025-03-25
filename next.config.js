/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  images: {
    unoptimized: true, // Changed to true for Vercel deployment
  },
  // Add performance optimizations for mobile
  experimental: {
    optimizeCss: true, // Enables CSS optimization
    optimizePackageImports: ['@/components/ui'],
  },
  // Add responsive headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Viewport',
            value: 'width=device-width, initial-scale=1, maximum-scale=5',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;