import "temporal-polyfill/full/global";

import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../../prisma8/generated/contract.js";
import contractJson from "../../prisma8/generated/contract.json" with { type: "json" };
import { DATABASE_URL } from "./server-env";

export const db8 = postgres<Contract>({
  contractJson,
  url: DATABASE_URL,
});
