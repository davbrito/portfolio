// vite.config.ts
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
    }),
    viteReact(),
    nitro(),
  ],
});
