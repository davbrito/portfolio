import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  vite: {
    plugins: [
      viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),
    ],
  },

  integrations: [
    react({
      babel: { plugins: [["babel-plugin-react-compiler"]] },
    }),
  ],

  env: {
    schema: {
      ENABLE_ADMIN_SETUP: envField.boolean({
        access: "public",
        context: "client",
        default: false,
        optional: true,
      }),
      ADMIN_SECRET: envField.string({
        access: "secret",
        context: "server",
        optional: true,
      }),
      DATABASE_URL: envField.string({
        access: "secret",
        context: "server",
        optional: false,
      }),
    },
  },
});
