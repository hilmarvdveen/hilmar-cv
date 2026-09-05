import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const ABBREVIATED_IDENTIFIERS = [
  "a", "b", "c", "d", "i", "j", "k", "m", "n", "p", "q", "r", "s", "v", "prev",
  "e", "err", "ev", "evt", "el", "elem",
  "res", "req", "resp", "cb", "ctx", "idx",
  "btn", "msg", "cfg", "fn", "func", "arr", "obj", "str", "num", "val",
  "tmp", "temp", "acc", "cur", "curr", "opts", "attr", "attrs",
  "desc", "pos", "len", "ret", "dir", "sub",
];

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
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "react-hooks/set-state-in-effect": "warn",
      "id-denylist": ["error", ...ABBREVIATED_IDENTIFIERS],
    },
  },
];

export default eslintConfig;
