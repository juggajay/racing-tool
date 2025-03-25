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
  // Remove CSS optimization that requires critters package
  experimental: {
    optimizeCss: false, // Disabled to avoid critters dependency
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