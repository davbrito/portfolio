import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import { loadEnv } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const { ISR_BYPASS_TOKEN, VERCEL_PROJECT_PRODUCTION_URL, VERCEL_URL } = loadEnv(
  process.env.NODE_ENV!,
  process.cwd(),
  "",
);

const url = VERCEL_PROJECT_PRODUCTION_URL || VERCEL_URL;

// https://astro.build/config
export default defineConfig({
  site: url ? `https://${url}` : undefined,
  security: {
    checkOrigin: true,
    allowedDomains: url ? [{ protocol: "https", hostname: url }] : undefined,
    csp: {
      scriptDirective: {
        resources: ["'self'"],
      },
    },
  },
  adapter: vercel({
    isr: {
      exclude: [/^\/.+/],
      bypassToken: ISR_BYPASS_TOKEN,
    },
  }),
  vite: {
    plugins: [viteTsConfigPaths({ projects: ["./tsconfig.json"] }), tailwindcss()],
    server: {
      allowedHosts: url ? [url] : [],
      hmr: {
        clientPort: 443,
        path: "/_hmr",
        protocol: "wss",
      },
    },
    ssr: {
      noExternal: ["@hcaptcha/react-hcaptcha", "@daveyplate/better-auth-ui"],
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

      DATABASE_URL: envField.string({
        access: "secret",
        context: "server",
        optional: false,
      }),

      DATABASE_URL_UNPOOLED: envField.string({
        access: "secret",
        context: "server",
        optional: false,
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

      BETTER_AUTH_SECRET: envField.string({
        access: "secret",
        context: "server",
        optional: false,
      }),

      VERCEL_PROJECT_PRODUCTION_URL: envField.string({
        access: "public",
        context: "server",
        optional: true,
      }),
      VERCEL_URL: envField.string({
        access: "public",
        context: "server",
        optional: true,
      }),
    },
  },
});
