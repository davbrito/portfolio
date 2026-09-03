import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { auth } from "./lib/auth";
import { db } from "./lib/db";
import { getClientIp } from "./lib/request-ip";

type AppRequestContext = {
  db: typeof db;
  auth: typeof auth;
  ip: string | undefined;
};

declare module "@tanstack/react-start" {
  interface Register {
    server: {
      requestContext: AppRequestContext;
    };
  }
}

export default createServerEntry({
  async fetch(request) {
    return handler.fetch(request, { context: { db, auth, ip: getClientIp(request.headers) } });
  },
});
