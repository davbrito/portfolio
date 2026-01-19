import { profilePayloadSchema } from "@/lib/validators/profile";
import { findProfile, upsertProfile } from "@/service/profile";
import { ActionError, defineAction, type ActionAPIContext } from "astro:actions";
import { ADMIN_EMAIL } from "astro:env/server";

async function ensureAdminSession(context: ActionAPIContext) {
  const session = context.locals.session;
  const user = context.locals.user;
  if (!session || !user) return null;

  if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) return null;

  return { session, user };
}

async function authenticateAction(context: ActionAPIContext) {
  const session = await ensureAdminSession(context);
  if (!session) {
    throw new ActionError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  return session;
}

const getProfileAction = defineAction({
  async handler(_, context) {
    const session = await authenticateAction(context);

    return await findProfile(session.user.id);
  },
});

const upsertProfileAction = defineAction({
  input: profilePayloadSchema,
  async handler(input, context) {
    const session = await authenticateAction(context);

    return await upsertProfile(session.user.id, input);
  },
});

export const profileActions = {
  get: getProfileAction,
  upsert: upsertProfileAction,
};
