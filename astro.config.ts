import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  vite: {
    plugins: [viteTsConfigPaths({ projects: ["./tsconfig.json"] }), tailwindcss()],
  },

  integrations: [
    react({
      babel: { plugins: [["babel-plugin-react-compiler"]] },
    }),
  ],

  experimental: {
    csp: {
      scriptDirective: { resources: ["'self'", "https://challenges.cloudflare.com"] },
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },

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
      ADMIN_EMAIL: envField.string({
        access: "secret",
        context: "server",
        optional: false,
      }),

      POSTGRES_URL: envField.string({
        access: "secret",
        context: "server",
        optional: false,
      }),

      POSTGRES_PRISMA_URL: envField.string({
        access: "secret",
        context: "server",
        optional: false,
      }),

      POSTGRES_URL_NON_POOLING: envField.string({
        access: "secret",
        context: "server",
        optional: false,
      }),

      DATABASE_SSL_CERT: envField.string({
        access: "secret",
        context: "server",
        optional: true,
      }),

      // Cloudflare Turnstile
      CF_TURNSTILE_SITE_KEY: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
      CF_TURNSTILE_SECRET_KEY: envField.string({
        access: "secret",
        context: "server",
        optional: true,
      }),
    },
  },
});
