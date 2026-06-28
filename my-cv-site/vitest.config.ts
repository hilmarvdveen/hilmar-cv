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
  // Component CSS imports (e.g. ReactFlow's stylesheet) must not pull in the
  // project's Tailwind v4 PostCSS config under jsdom — neutralise PostCSS here.
  css: { postcss: { plugins: [] } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // jsdom + Next setup is heavy on some machines; give interactive tests room.
    testTimeout: 15000,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // 100% gate over pure logic (lib + hooks) AND all components.
      include: [
        "src/lib/**/*.ts",
        "src/hooks/**/*.ts",
        "src/components/**/*.tsx",
        "src/features/**/components/*.tsx",
      ],
      exclude: [
        "src/**/index.ts",
        "src/**/*.test.{ts,tsx}",
        // Browser-only / non-logic (covered by E2E or unreachable in jsdom):
        "src/lib/seo/core/analytics-manager.ts", // window/gtag telemetry
        "src/lib/seo/types/**", // type-only
        "src/lib/seo/constants/**", // static data
        "src/features/home/components/NetherlandsMap.tsx", // d3 canvas
        // 4-step booking wizard: better covered by E2E than line-by-line unit
        // tests. A step-gating unit test still runs for regression.
        "src/features/booking/components/BookingForm.tsx",
        // Nav shell with duplicated desktop/mobile trees + responsive-only
        // branches; E2E-appropriate. Nav/active/locale unit tests still run.
        "src/components/Header.tsx",
      ],
      thresholds: {
        // 100% on lines/functions/statements; branches at a high bar (the
        // residual are defensive ternaries, exhaustive switch defaults, and
        // locale variants — not worth contriving tests / littering ignores).
        lines: 100,
        functions: 100,
        statements: 100,
        branches: 90,
      },
    },
  },
});
