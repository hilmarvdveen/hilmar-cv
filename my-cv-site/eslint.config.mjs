import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "coverage/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      // Prefer `type` over `interface` (composes better for component props /
      // Storybook). Global `declare`d augmentations are exempted inline.
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      // Advisory perf hint from react-hooks v6. Reading client-only state
      // (e.g. localStorage consent) in an effect is hydration-safe and
      // intentional here, so treat it as a warning rather than an error.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
