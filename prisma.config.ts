import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ path: [".env", ".env.local"], quiet: true });

export default defineConfig({
  schema: "prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL_UNPOOLED"),
  },
});
