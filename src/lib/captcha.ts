import { createServerOnlyFn } from "@tanstack/react-start";

export const validateTurnstileToken = createServerOnlyFn(
  async (
    token: string,
    ipAddress: string,
  ): Promise<{
    success: boolean;
    challenge_ts: string;
    hostname: string;
    "error-codes"?: string[];
  }> => {
    const CF_TURNSTILE_SECRET_KEY = process.env.CF_TURNSTILE_SECRET_KEY;
    if (!CF_TURNSTILE_SECRET_KEY) {
      console.error("CF_TURNSTILE_SECRET_KEY is not set");
      throw new Error("Turnstile secret key is not configured.");
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
  },
);
