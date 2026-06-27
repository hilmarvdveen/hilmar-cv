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
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // The gate covers our pure, unit-tested logic (lib + hooks). Components
      // and pages are exercised by RTL/route tests for regression but are not
      // in the threshold (heavy JSX/d3/window code skews the numbers).
      include: ["src/lib/**/*.ts", "src/hooks/**/*.ts"],
      exclude: [
        "src/**/index.ts",
        "src/**/*.test.{ts,tsx}",
        "src/lib/seo/core/analytics-manager.ts",
        "src/lib/seo/types/**",
        "src/lib/seo/constants/**",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        statements: 70,
        branches: 60,
      },
    },
  },
});
