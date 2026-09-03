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
  GITHUB_CLIENT_ID: z.string().nonempty({ message: "GITHUB_CLIENT_ID is required" }),
  GITHUB_CLIENT_SECRET: z.string().nonempty({ message: "GITHUB_CLIENT_SECRET is required" }),
  STORAGE_KEY_ID: z.string().nonempty({ message: "STORAGE_KEY_ID is required" }),
  STORAGE_KEY_SECRET: z.string().nonempty({ message: "STORAGE_KEY_SECRET is required" }),
  STORAGE_ENPOINT: z.string().nonempty({ message: "STORAGE_ENPOINT is required" }),
  STORAGE_BUCKET: z.string().nonempty({ message: "STORAGE_BUCKET is required" }),
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
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  STORAGE_KEY_ID,
  STORAGE_KEY_SECRET,
  STORAGE_ENPOINT,
  STORAGE_BUCKET,
} = env.data;

export const vercelUrl = VERCEL_PROJECT_PRODUCTION_URL || VERCEL_URL;

export const siteUrl = vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000";
