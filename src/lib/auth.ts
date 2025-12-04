import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { verifyAdminToken } from "./auth/admin-secret";
import { db } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
    transaction: true,
    usePlural: true,
  }),
  plugins: [passkey(), tanstackStartCookies()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
  },
  databaseHooks: {
    user: {
      create: {
        async before(user, context) {
          const token = context?.request?.headers.get("x-admin-token");
          console.log("Creating user with admin token:", token);

          if (!token || !verifyAdminToken(token)) {
            throw new APIError("UNAUTHORIZED", {
              message: "Invalid admin token",
            });
          }

          if (user.email !== process.env.ADMIN_EMAIL) {
            throw new APIError("UNAUTHORIZED", {
              message: "Only admin user can be created",
            });
          }
        },
      },
    },
  },
});
