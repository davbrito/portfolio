import { ActionError, type ActionAPIContext } from "astro:actions";
import { ADMIN_EMAIL } from "astro:env/server";
import { verifyAdminToken } from "./admin-secret";

export function adminTokenCheck(token: string | null | undefined): token is string {
  return !!token && verifyAdminToken(token);
}

async function ensureAdminSession(context: ActionAPIContext) {
  const session = context.locals.session;
  const user = context.locals.user;

  if (!session || !user) return null;

  if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) return null;

  return { session, user };
}

export async function authenticateAction(context: ActionAPIContext) {
  const session = await ensureAdminSession(context);
  if (!session) {
    throw new ActionError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  return session;
}
