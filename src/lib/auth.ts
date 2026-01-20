import { passkey } from "@better-auth/passkey";
import { ADMIN_EMAIL, BETTER_AUTH_SECRET, CF_TURNSTILE_SECRET_KEY } from "astro:env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { captcha } from "better-auth/plugins";
import { verifyAdminToken } from "./auth/admin-secret";
import { db } from "./db";

const vercelUrl = import.meta.env.VERCEL_PROJECT_PRODUCTION_URL || import.meta.env.VERCEL_URL;

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  trustedOrigins: [vercelUrl ? `https://${vercelUrl}` : ""].filter(Boolean),
  database: prismaAdapter(db, {
    provider: "postgresql",
    transaction: true,
    usePlural: true,
  }),
  plugins: [
    passkey(),
    captcha({
      provider: "cloudflare-turnstile",
      secretKey: CF_TURNSTILE_SECRET_KEY,
    }),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
  },
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60, // Cache duration in seconds (5 minutes)
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

          if (user.email !== ADMIN_EMAIL) {
            throw new APIError("UNAUTHORIZED", {
              message: "Only admin user can be created",
            });
          }
        },
      },
    },
  },
});
