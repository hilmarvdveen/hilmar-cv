import type { NextConfig } from "next";
import i18nConfig from "./next-i18next.config.js";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: i18nConfig.i18n, // Only pass the "i18n" subkey
};

export default nextConfig;