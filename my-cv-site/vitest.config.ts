import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: { postcss: { plugins: [] } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    testTimeout: 15000,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/lib/**/*.ts",
        "src/hooks/**/*.ts",
        "src/components/**/*.tsx",
        "src/features/**/components/*.tsx",
      ],
      exclude: [
        "src/**/index.ts",
        "src/**/*.test.{ts,tsx}",
        "src/lib/seo/types/**",
        "src/lib/seo/constants/**",
        "src/features/about/components/NetherlandsMap.tsx",
        "src/features/booking/components/BookingForm.tsx",
        "src/components/Header.tsx",
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        statements: 100,
        branches: 90,
      },
    },
  },
});
