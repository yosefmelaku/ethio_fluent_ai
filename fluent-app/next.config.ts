import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production deployment
  output: 'standalone',
  
  // External packages for server components
  serverExternalPackages: ['openai'],
  
  // Configure headers for better security and performance
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
