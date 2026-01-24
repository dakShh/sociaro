import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXTAUTH_URL ? '' : undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
