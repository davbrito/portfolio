import type * as ServerEnv from "astro:env/server";

export const {
  BETTER_AUTH_SECRET,
  CF_TURNSTILE_SECRET_KEY,
  VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_URL,
  ADMIN_EMAIL,
  ADMIN_SECRET,
  DATABASE_SSL_CERT,
  POSTGRES_PRISMA_URL,
} = import.meta.env as any as typeof ServerEnv;
