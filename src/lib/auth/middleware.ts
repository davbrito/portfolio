import { auth } from "#/lib/auth.ts";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { isAdminEmail } from "./helpers";

export const getAuthSession = createServerFn().handler(async () => {
  return await auth.api.getSession({
    headers: getRequestHeaders(),
  });
});

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  const data = await auth.api.getSession({
    headers: request.headers,
  });

  return next({
    context: data
      ? {
          user: data.user,
          session: data.session,
        }
      : {
          user: null,
          session: null,
        },
  });
});

export const adminMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ context, next }) => {
    const session = context.session;
    const user = context.user;

    if (!session || !user || !isAdminEmail(user.email)) throw new Error("Unauthorized");

    return next({ context: { session, user } });
  });
