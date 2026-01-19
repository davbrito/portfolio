import { ActionError } from "astro:actions";
import { CF_TURNSTILE_SECRET_KEY } from "astro:env/server";

export async function validateTurnstileToken(token: string, ipAddress: string) {
  if (!CF_TURNSTILE_SECRET_KEY) {
    console.error("CF_TURNSTILE_SECRET_KEY is not set");
    throw new ActionError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal error",
    });
  }

  const formData = new URLSearchParams();
  formData.append("secret", CF_TURNSTILE_SECRET_KEY);
  formData.append("response", token);
  formData.append("remoteip", ipAddress);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
  });
  return await res.json();
}
