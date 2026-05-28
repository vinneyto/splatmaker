import type { NextConfig } from "next";

const proxyBase =
  process.env.FRONTEND_API_PROXY_BASE_URL?.trim().replace(/\/+$/, "") ||
  "http://localhost:8787";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${proxyBase}/api/v1/:path*`,
      },
      {
        source: "/media/:path*",
        destination: `${proxyBase}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
