import pluginReact from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import query from "@tanstack/eslint-plugin-query";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores([
    "node_modules/",
    "dist/",
    "build/",
    ".astro/",
    "prisma/generated/",
    "prisma8/generated/",
    ".vercel/",
    ".output/",
    "src/routeTree.gen.ts",
  ]),

  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    extends: [
      pluginReact.configs["recommended-typescript"],
      pluginReactHooks.configs.flat["recommended-latest"],
      pluginReact.configs["disable-conflict-eslint-plugin-react-hooks"],
      query.configs["flat/recommended"],
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
  {
    name: "shadcnui components",
    files: ["src/components/ui/**/*.{ts,tsx}", "src/components/auth/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "off",
      "@eslint-react/no-nested-component-definitions": "off",
      "@eslint-react/static-components": "off",
      "@eslint-react/set-state-in-effect": "off",
      "@eslint-react/naming-convention-ref-name": "off",
      "@eslint-react/use-state": "off",
      "react-hooks/preserve-manual-memoization": "off",
    },
  },
);
