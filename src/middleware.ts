import { defineMiddleware } from "astro:middleware";
import { auth } from "./lib/auth";

const PUBLIC_PATTERNS = [
  new URLPattern({ pathname: "/" }),
  new URLPattern({ pathname: "/api/auth/*" }),
  new URLPattern({ pathname: "/auth/*" }),
];

export const onRequest = defineMiddleware(async (context, next) => {
  if (PUBLIC_PATTERNS.some((pattern) => pattern.test(context.url))) {
    return next();
  }

  const data = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (data) {
    context.locals.user = data.user;
    context.locals.session = data.session;
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }
  return next();
});
