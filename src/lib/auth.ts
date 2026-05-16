import "@tanstack/react-start/server-only";

import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { captcha } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { validateUserCreation } from "./auth/db-hooks";
import { db } from "./db";
import { BETTER_AUTH_SECRET, CF_TURNSTILE_SECRET_KEY, vercelUrl } from "./server-env";

export const auth = betterAuth({
  baseURL: vercelUrl ? `https://${vercelUrl}` : undefined,
  secret: BETTER_AUTH_SECRET,
  trustedOrigins: [vercelUrl ? `https://${vercelUrl}` : "", import.meta.env.DEV ? "http://localhost:3000" : ""].filter(
    Boolean,
  ),

  database: prismaAdapter(db, {
    provider: "postgresql",
    transaction: true,
    usePlural: true,
  }),
  plugins: [
    tanstackStartCookies(),
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
  rateLimit: {
    enabled: true,
    storage: "database",
  },
  databaseHooks: {
    user: {
      create: {
        async before(user, context) {
          validateUserCreation(user, context);
        },
      },
    },
  },
});
