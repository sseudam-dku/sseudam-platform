import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        urlPattern: /\/assets\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
    ],
  },
});

const API_PROXY_TARGET = process.env.API_PROXY_TARGET;

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    if (!API_PROXY_TARGET) {
      return [];
    }
    return [
      {
        source: "/backend/:path*",
        destination: `${API_PROXY_TARGET}/:path*`,
      },
    ];
  },
};

export default withPWA(nextConfig);
