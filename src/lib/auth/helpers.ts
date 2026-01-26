import { ActionError, type ActionAPIContext } from "astro:actions";
import { ADMIN_EMAIL } from "astro:env/server";
import { verifyAdminToken } from "./admin-secret";

export function adminTokenCheck(token: string | null | undefined): token is string {
  return !!token && verifyAdminToken(token);
}

async function ensureAdminSession(context: ActionAPIContext) {
  const session = context.locals.session;
  const user = context.locals.user;

  if (!session || !user || !isAdminEmail(user.email)) return null;

  return { session, user };
}

export async function authenticateAction(context: ActionAPIContext) {
  const session = await ensureAdminSession(context);
  if (!session) {
    throw new ActionError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  return session;
}

export function isAdminEmail(email: string): boolean {
  const allowedEmails = ADMIN_EMAIL.split(",").map((e) => e.trim().toLowerCase());
  return allowedEmails.includes(email.toLowerCase());
}
