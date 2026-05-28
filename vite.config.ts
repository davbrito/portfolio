import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    devtoolsJson({ uuid: "2c6c7bac-793d-46e1-99be-8d1945cf99c9" }),
    tailwindcss(),
    tanstackStart({
      router: {
        routesDirectory: "pages",
      },
      rsc: { enabled: false },
    }),
    viteReact(),
    nitro({
      vercel: {
        config: {
          version: 3,
          bypassToken: process.env.ISR_BYPASS_TOKEN,
        },
        functions: {
          runtime: "nodejs24.x",
        },
      },
      routeRules: {
        "/": {
          isr: {
            expiration: false,
          },
        },
        "/curriculum.pdf": {
          isr: {
            expiration: false,
          },
        },
        // Vercel Bot Protection routes
        "/149e9513-01fa-4fb0-aad4-566afd725d1b/2d206a39-8ed7-437e-a3be-862e0f06eea3/a-4-a/c.js": {
          proxy: "https://api.vercel.com/bot-protection/v1/challenge",
        },
        "/149e9513-01fa-4fb0-aad4-566afd725d1b/2d206a39-8ed7-437e-a3be-862e0f06eea3/**": {
          proxy: "https://api.vercel.com/bot-protection/v1/proxy/**",
          headers: {
            "X-Frame-Options": "SAMEORIGIN",
          },
        },
      },
    }),
  ],
});
