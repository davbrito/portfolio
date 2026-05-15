import { createIsomorphicFn } from "@tanstack/react-start";

export const {
  BETTER_AUTH_SECRET,
  CF_TURNSTILE_SECRET_KEY,
  VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_URL,
  ADMIN_EMAIL,
  ADMIN_SECRET,
  DATABASE_URL,
} = createIsomorphicFn()
  .server(() => process.env)
  .client(() => import.meta.env)();

export const vercelUrl = VERCEL_PROJECT_PRODUCTION_URL || VERCEL_URL;

export const siteUrl = vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000";
