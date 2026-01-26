import { ActionError, type ActionAPIContext } from "astro:actions";
import { isAdminEmail } from "./helpers";

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
