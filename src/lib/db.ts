import { PrismaNeon } from "@prisma/adapter-neon";
import { DATABASE_URL } from "astro:env/server";
import { PrismaClient } from "../../prisma/generated/client";

const connectionString = `${DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
const db = new PrismaClient({ adapter });

export { db };
