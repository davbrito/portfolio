import { validateTurnstileToken } from "@/lib/captcha";
import { ActionError, defineAction } from "astro:actions";
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
    const validation = await validateTurnstileToken(token, context.clientAddress);
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
