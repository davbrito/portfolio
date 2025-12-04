import { redirect } from "@tanstack/react-router";
import { createMiddleware, createServerOnlyFn } from "@tanstack/react-start";
import { auth } from "../auth";
import { verifyAdminToken } from "./admin-secret";

const getSession = createServerOnlyFn((headers: Headers) => {
  return auth.api.getSession({ headers }).catch((error) => {
    console.error(error);
    return null;
  });
});

const sessionMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await getSession(request.headers);
    if (session && "error" in session) {
      console.error("Failed to get session:", session.error);
      return await next({ context: { session: null } });
    }

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
