import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_SSL_CERT, POSTGRES_PRISMA_URL } from "./server-env";
import { PrismaClient } from "../../prisma/generated/client";

const adapter = new PrismaPg({
  connectionString: POSTGRES_PRISMA_URL.replace(/sslmode=require&?/, ""),
  ssl: {
    rejectUnauthorized: true,
    ca: DATABASE_SSL_CERT,
  },
});
const db = new PrismaClient({ adapter });

export { db };
