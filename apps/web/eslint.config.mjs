import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  {
    ignores: [
      "public/sw.js",
      "public/workbox-*.js",
      "public/fallback-*.js",
      "public/worker-*.js",
      "public/swe-worker-*.js",
    ],
  },
  ...nextVitals,
  ...nextTs,
]);
