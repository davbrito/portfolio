import { PrismaPg } from "@prisma/adapter-pg";
import { POSTGRES_URL } from "astro:env/server";
import { PrismaClient } from "../../prisma/generated/client";

const adapter = new PrismaPg({
  connectionString: POSTGRES_URL,
  ssl: import.meta.env.PROD
    ? {
        rejectUnauthorized: true,
        ca: import.meta.env.DATABASE_SSL_CERT!,
      }
    : false,
});
const db = new PrismaClient({ adapter });

export { db };
