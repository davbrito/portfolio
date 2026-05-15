import { adminMiddleware } from "@/lib/auth/middleware";
import { validateTurnstileToken } from "@/lib/captcha";
import { db } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import * as z from "zod";

export const contactFormAction = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
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
  )
  .handler(async (ctx) => {
    const input = ctx.data;
    const context = ctx.context;
    const token = input.cfTurnstileResponse;

    if (!token) {
      throw new Error("Turnstile token is required");
    }

    const ipAddress = getRequestIP({ xForwardedFor: true })!;
    const validation = await validateTurnstileToken(token, ipAddress);

    if (!validation.success) {
      console.error("Turnstile validation failed: %O", validation);
      throw new Error("Verificación fallida");
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
  });

export const messagesActions = {
  list: createServerFn({ method: "GET" })
    .middleware([adminMiddleware])
    .inputValidator(
      z.object({
        filter: z.enum(["all", "read", "unread"]).default("all"),
      }),
    )
    .handler(async (ctx) => {
      const input = ctx.data;

      return await db.messages.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 500,
        where: input.filter === "read" ? { readAt: { not: null } } : input.filter === "unread" ? { readAt: null } : {},
      });
    }),
  markRead: createServerFn({ method: "POST" })
    .middleware([adminMiddleware])
    .inputValidator(z.object({ id: z.string().uuid({ message: "ID inválido" }) }))
    .handler(async (ctx) => {
      const input = ctx.data;

      await db.messages.update({
        where: { id: input.id },
        data: { readAt: new Date() },
      });
    }),
  delete: createServerFn({ method: "POST" })
    .middleware([adminMiddleware])
    .inputValidator(z.object({ id: z.uuid({ error: "ID inválido" }) }))
    .handler(async (ctx) => {
      const input = ctx.data;

      await db.messages.delete({
        where: { id: input.id },
      });
    }),
};
