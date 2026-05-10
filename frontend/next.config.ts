import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV !== "development") {
      return [];
    }

    return [
      {
        source: "/v1/:path*",
        destination: "http://localhost:8787/v1/:path*",
      },
      {
        source: "/healthz",
        destination: "http://localhost:8787/healthz",
      },
    ];
  },
};

export default nextConfig;
