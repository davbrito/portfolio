import z from "zod";

export const CF_TURNSTILE_SITE_KEY = import.meta.env.VITE_CF_TURNSTILE_SITE_KEY;
export const ENABLE_ADMIN_SETUP =
  import.meta.env.VITE_ENABLE_ADMIN_SETUP === "true" || import.meta.env.VITE_ENABLE_ADMIN_SETUP === "1";
