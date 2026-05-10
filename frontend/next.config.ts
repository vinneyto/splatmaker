import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV !== "development") {
      return [];
    }

    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:8787/api/v1/:path*",
      },
      {
        source: "/api/healthz",
        destination: "http://localhost:8787/api/healthz",
      },
    ];
  },
};

export default nextConfig;
