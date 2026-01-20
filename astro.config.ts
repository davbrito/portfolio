import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import { loadEnv } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const { ISR_BYPASS_TOKEN } = loadEnv(process.env.NODE_ENV!, process.cwd());

// https://astro.build/config
export default defineConfig({
  adapter: vercel({
    isr: {
      exclude: [/^\/auth\/.*/, /^\/admin\/.*/],
      bypassToken: ISR_BYPASS_TOKEN,
    },
  }),
  vite: {
    plugins: [viteTsConfigPaths({ projects: ["./tsconfig.json"] }), tailwindcss()],
    server: {
      hmr: {
        clientPort: 443,
        path: "/_hmr",
        protocol: "wss",
      },
    },
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
        optional: false,
      }),
      CF_TURNSTILE_SECRET_KEY: envField.string({
        access: "secret",
        context: "server",
        optional: false,
      }),

      ISR_BYPASS_TOKEN: envField.string({
        access: "secret",
        context: "server",
        optional: false,
      }),
    },
  },
});
