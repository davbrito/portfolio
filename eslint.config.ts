import js from "@eslint/js";
import query from "@tanstack/eslint-plugin-query";
import eslintPluginAstro from "eslint-plugin-astro";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores(["node_modules/", "dist/", "build/", ".astro/", "prisma/", ".vercel/"]),

  js.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    settings: {
      react: { version: "detect" },
    },
    extends: [
      pluginReact.configs.flat.recommended,
      pluginReact.configs.flat["jsx-runtime"],
      pluginReactHooks.configs.flat["recommended-latest"],
      query.configs["flat/recommended"],
    ],
    rules: {
      "react/jsx-no-leaked-render": "warn",
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  },
  {
    name: "shadcnui components",
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "off",
      "react/jsx-no-leaked-render": "off",
    },
  },
  {
    name: "astro files",
    files: ["**/*.astro"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "Props" }],
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          globalReturn: true,
        },
      },
    },
  },
);
