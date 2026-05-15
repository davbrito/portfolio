import "@tanstack/react-start/server-only";
import z from "zod";

const schema = z.object({
  BETTER_AUTH_SECRET: z.string().nonempty({ message: "BETTER_AUTH_SECRET is required" }),
  CF_TURNSTILE_SECRET_KEY: z.string().nonempty({ message: "CF_TURNSTILE_SECRET_KEY is required" }),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  VERCEL_URL: z.string().optional(),
  ADMIN_EMAIL: z
    .email({ message: "ADMIN_EMAIL must be a valid email" })
    .nonempty({ message: "ADMIN_EMAIL is required" }),
  ADMIN_SECRET: z.string().optional(),
  DATABASE_URL: z.string().nonempty({ message: "DATABASE_URL is required" }),
});

const env = schema.safeParse(process.env);

if (!env.success) {
  console.error("Environment variable validation failed:", z.treeifyError(env.error));
  throw new Error("Invalid environment variables");
}

export const {
  BETTER_AUTH_SECRET,
  CF_TURNSTILE_SECRET_KEY,
  VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_URL,
  ADMIN_EMAIL,
  ADMIN_SECRET,
  DATABASE_URL,
} = env.data;

export const vercelUrl = VERCEL_PROJECT_PRODUCTION_URL || VERCEL_URL;

export const siteUrl = vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000";
