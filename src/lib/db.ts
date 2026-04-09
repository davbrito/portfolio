import { PrismaNeon } from "@prisma/adapter-neon";
import { DATABASE_URL } from "./server-env";
import { PrismaClient } from "../../prisma/generated/client";

const adapter = new PrismaNeon({ connectionString: DATABASE_URL });
const db = new PrismaClient({ adapter });

export { db };
