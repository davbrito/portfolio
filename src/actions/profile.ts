import { profilePayloadSchema } from "@/lib/validators/profile";
import { findProfile, upsertProfile } from "@/service/profile";
import { ActionError, defineAction, type ActionAPIContext } from "astro:actions";
import { ADMIN_EMAIL, ISR_BYPASS_TOKEN } from "astro:env/server";

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

    const data = await findProfile(session.user.id);
    return (
      data && {
        ...data,
        experiences:
          data?.experiences.map((exp) => ({
            ...exp,
            highlights: exp.highlights.join("\n\n"),
          })) || [],
      }
    );
  },
});

const upsertProfileAction = defineAction({
  input: profilePayloadSchema,
  async handler(input, context) {
    const session = await authenticateAction(context);

    await upsertProfile(session.user.id, input);

    if (context.site) {
      const urlToRevalidate = new URL("/", context.site);
      console.log("Revalidating ISR for", urlToRevalidate.toString());
      await fetch(urlToRevalidate, {
        method: "HEAD",
        headers: { "x-prerender-revalidate": ISR_BYPASS_TOKEN },
      });
    }
  },
});

export const profileActions = {
  get: getProfileAction,
  upsert: upsertProfileAction,
};
