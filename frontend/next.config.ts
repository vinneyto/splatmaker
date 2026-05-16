import type { NextConfig } from "next";

const proxyBase = process.env.FRONTEND_API_PROXY_BASE_URL?.trim().replace(
  /\/+$/,
  "",
);

const nextConfig: NextConfig = {
  output: "export",
  async rewrites() {
    if (process.env.NODE_ENV !== "development") {
      return [];
    }

    const destinationBase = proxyBase || "http://localhost:8787";

    return [
      {
        source: "/api/v1/:path*",
        destination: `${destinationBase}/api/v1/:path*`,
      },
      {
        source: "/api/healthz",
        destination: `${destinationBase}/api/healthz`,
      },
      {
        source: "/media/:path*",
        destination: `${destinationBase}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
