import { ActionError, defineAction } from "astro:actions";
import { CF_TURNSTILE_SECRET_KEY } from "astro:env/server";
import { z } from "astro:schema";

export const contactFormAction = defineAction({
  accept: "json",
  input: z.object({
    cfTurnstileResponse: z.string({ message: "Turnstile response is required" }),
    name: z.string().min(2, { message: "Nombre es requerido" }).max(100).nonempty({ message: "Nombre es requerido" }),
    email: z.string().email({ message: "Correo inválido" }),
    subject: z
      .string()
      .min(2, { message: "El asunto es requerido" })
      .max(200)
      .nonempty({ message: "El asunto es requerido" }),
    message: z
      .string()
      .min(10, { message: "El mensaje es requerido" })
      .max(5000, { message: "Mensaje muy largo" })
      .nonempty({ message: "El mensaje es requerido" }),
  }),
  async handler(input, context) {
    console.log("Contact form action invoked");
    const token = input.cfTurnstileResponse;
    if (!token) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Turnstile token is required",
      });
    }
    const ipAddress =
      context.request.headers.get("x-forwarded-for") || context.request.headers.get("cf-connecting-ip") || "unknown";
    const validation = await validateTurnstileToken(token, ipAddress);
    console.log("Contact form submitted:", validation, input);

    if (!validation.success) {
      console.error("Turnstile validation failed: %O", validation);
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Verificación fallida",
      });
    }

    return { success: true };
  },
});

async function validateTurnstileToken(token: string, ipAddress: string) {
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
