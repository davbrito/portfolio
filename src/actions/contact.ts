import { authenticateAction } from "@/lib/auth/actions";
import { validateTurnstileToken } from "@/lib/captcha";
import { db } from "@/lib/db";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";

export const contactFormAction = defineAction({
  accept: "json",
  input: z.object({
    cfTurnstileResponse: z.string({ error: "Turnstile response is required" }),
    profileId: z.string(),
    name: z.string().min(2, { error: "Nombre es requerido" }).max(100).nonempty({ error: "Nombre es requerido" }),
    email: z.email({ error: "Correo inválido" }),
    subject: z
      .string()
      .min(2, { error: "El asunto es requerido" })
      .max(200)
      .nonempty({ error: "El asunto es requerido" }),
    message: z
      .string()
      .nonempty({ error: "El mensaje es requerido" })
      .min(10, { error: "El mensaje es muy corto" })
      .max(5000, { error: "Mensaje muy largo" }),
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
    input: z.object({
      filter: z.enum(["all", "read", "unread"]).default("all"),
    }),
    async handler(input, context) {
      await authenticateAction(context);

      return await db.messages.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 500,
        where: input.filter === "read" ? { readAt: { not: null } } : input.filter === "unread" ? { readAt: null } : {},
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
    input: z.object({ id: z.uuid({ error: "ID inválido" }) }),
    async handler(input, context) {
      await authenticateAction(context);

      await db.messages.delete({
        where: { id: input.id },
      });
    },
  }),
};
