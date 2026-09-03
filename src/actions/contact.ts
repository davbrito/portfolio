import { adminMiddleware } from "@/lib/auth/middleware";
import { validateTurnstileToken } from "@/lib/captcha";
import { db8 } from "@/lib/db8";
import { createServerFn } from "@tanstack/react-start";
import * as z from "zod";

export const contactFormAction = createServerFn({ method: "POST" })
  .validator(
    z.object({
      profileId: z.string(),
      turnstileToken: z.string().nonempty({ error: "Verificación de seguridad requerida" }),
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

    const verification = await validateTurnstileToken(input.turnstileToken, ctx.context.ip);
    if (!verification.success) {
      throw new Error("Verificación de seguridad fallida. Intenta nuevamente.");
    }

    await db8.orm.public.Messages.create({
      profileId: input.profileId,
      email: input.email,
      name: input.name,
      subject: input.subject,
      message: input.message,
    });

    return { success: true };
  });

export const listMessagesAction = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .validator(
    z.object({
      filter: z.enum(["all", "read", "unread"]).default("all"),
    }),
  )
  .handler(async (ctx) => {
    const input = ctx.data;

    let query = db8.orm.public.Messages.orderBy([(m) => m.createdAt.desc(), (m) => m.id.desc()]).limit(500);

    if (input.filter === "read") query = query.where((m) => m.readAt.isNotNull());
    else if (input.filter === "unread") query = query.where((m) => m.readAt.isNull());

    const messages = await query.all();

    return messages.map((message) => ({
      ...message,
      createdAt: message.createdAt.toString(),
      readAt: message.readAt ? message.readAt.toString() : null,
    }));
  });

export const markReadMessageAction = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.object({ id: z.uuid({ message: "ID inválido" }) }))
  .handler(async (ctx) => {
    const input = ctx.data;

    await db8.orm.public.Messages.where({ id: input.id }).update({ readAt: Temporal.Now.plainDateTimeISO() });
  });

export const deleteMessageAction = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.object({ id: z.uuid({ error: "ID inválido" }) }))
  .handler(async (ctx) => {
    const input = ctx.data;

    await db8.orm.public.Messages.where({ id: input.id }).delete();
  });
