import { authenticateAction } from "@/lib/auth/helpers";
import { validateTurnstileToken } from "@/lib/captcha";
import { db } from "@/lib/db";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

export const contactFormAction = defineAction({
  accept: "json",
  input: z.object({
    cfTurnstileResponse: z.string({ message: "Turnstile response is required" }),
    profileId: z.string(),
    name: z.string().min(2, { message: "Nombre es requerido" }).max(100).nonempty({ message: "Nombre es requerido" }),
    email: z.string().email({ message: "Correo inválido" }),
    subject: z
      .string()
      .min(2, { message: "El asunto es requerido" })
      .max(200)
      .nonempty({ message: "El asunto es requerido" }),
    message: z
      .string()
      .nonempty({ message: "El mensaje es requerido" })
      .min(10, { message: "El mensaje es muy corto" })
      .max(5000, { message: "Mensaje muy largo" }),
  }),
  async handler(input, context) {
    const token = input.cfTurnstileResponse;

    if (!token) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Turnstile token is required",
      });
    }

    const validation = await validateTurnstileToken(token, context.clientAddress);

    if (!validation.success) {
      console.error("Turnstile validation failed: %O", validation);
      throw new ActionError({ code: "BAD_REQUEST", message: "Verificación fallida" });
    }

    await db.messages.create({
      data: {
        profileId: input.profileId,
        email: input.email,
        name: input.name,
        subject: input.subject,
        message: input.message,
      },
    });

    return { success: true };
  },
});

export const messagesActions = {
  list: defineAction({
    async handler(_, context) {
      await authenticateAction(context);

      return await db.messages.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 500,
      });
    },
  }),
  markRead: defineAction({
    input: z.object({ id: z.string().uuid({ message: "ID inválido" }) }),
    async handler(input, context) {
      await authenticateAction(context);

      await db.messages.update({
        where: { id: input.id },
        data: { readAt: new Date() },
      });
    },
  }),
  delete: defineAction({
    input: z.object({ id: z.string().uuid({ message: "ID inválido" }) }),
    async handler(input, context) {
      await authenticateAction(context);

      await db.messages.delete({
        where: { id: input.id },
      });
    },
  }),
};
