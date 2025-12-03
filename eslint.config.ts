import js from "@eslint/js";
import query from "@tanstack/eslint-plugin-query";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  pluginReactHooks.configs.flat["recommended-latest"],
  query.configs["flat/recommended"],
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
