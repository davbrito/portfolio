import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ path: [".env", ".vercel/.env.development.local"] });

export default defineConfig({
  schema: "prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("POSTGRES_URL_NON_POOLING"),
  },
});
