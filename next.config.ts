import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/Layken-Varholdt-AI-Engineer-Resume.pdf',
        destination: '/Layken-Varholdt-Software-Engineer-Resume.pdf',
        permanent: true,
      },
    ];
  },
  images: { formats: ['image/avif', 'image/webp'] },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
