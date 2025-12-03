import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "../auth";
import { verifyAdminToken } from "./admin-secret";

export const softPrivateMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const hasSessionCookie = !!getSessionCookie(request);

    if (!hasSessionCookie) {
      throw redirect({
        to: "/admin/login",
        search: { redirect: request.url },
      });
    }

    return next();
  },
);

const sessionMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    return await next({ context: { session } });
  },
);

export const privateMiddleware = createMiddleware()
  .middleware([sessionMiddleware])
  .server(async ({ next, request, context }) => {
    const session = context.session;

    if (!session) {
      throw redirect({
        to: "/admin/login",
        search: { redirect: request.url },
      });
    }

    return await next({ context: { session } });
  });

export const publicOnlyMiddleware = createMiddleware()
  .middleware([sessionMiddleware])
  .server(async ({ next, context }) => {
    if (context.session) {
      throw redirect({ to: "/admin" });
    }

    return next({ context: { session: context.session } });
  });

export const adminTokenMiddleware = createMiddleware({
  type: "request",
}).server(async ({ next, request }) => {
  const token = new URL(request.url).searchParams.get("token");

  if (!token || !verifyAdminToken(token)) {
    throw redirect({ to: "/admin/login" });
  }

  return next();
});
