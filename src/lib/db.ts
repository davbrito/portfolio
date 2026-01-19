import { PrismaPg } from "@prisma/adapter-pg";
import { POSTGRES_URL } from "astro:env/server";
import { PrismaClient } from "../../prisma/generated/client";

const adapter = new PrismaPg({ connectionString: POSTGRES_URL });
const db = new PrismaClient({ adapter });

export { db };
