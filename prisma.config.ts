import { config } from "dotenv";
import { definePrismaConfig } from "prisma/config";
import { defineConfig as definePostgresConfig } from "@prisma/orm-postgres/config";

config({ path: [".env", ".env.local"], quiet: true });

export default definePrismaConfig({
  orm: definePostgresConfig({
    contract: "./prisma8/contract.prisma",
    output: "./prisma8/generated",
    db: {
      connection: process.env["DATABASE_URL"]!,
    },
  }),
});
