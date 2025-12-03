import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { verifyAdminToken } from "./auth/admin-secret";
import { db } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
    transaction: true,
    usePlural: true,
  }),
  plugins: [passkey()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (!ctx.path.startsWith("/sign-up")) {
        return;
      }
      const token = ctx.request?.headers.get("x-admin-token");
      if (!token || !verifyAdminToken(token)) {
        throw new APIError("UNAUTHORIZED", { message: "Invalid admin token" });
      }
    }),
  },
});
