import { profilePayloadSchema, type ProfilePayloadInput } from "@/lib/validators/profile";
import { findProfile, revalidatePortfolioPage, upsertProfile } from "@/service/profile";
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

    const data = await findProfile(session.user.id);
    if (!data) return null;

    const payload: ProfilePayloadInput = {
      ...data,
      experiences:
        data.experiences.map((exp) => ({
          title: exp.title,
          company: exp.company,
          location: exp.location,
          period: exp.period,
          highlights: exp.highlights.join("\n\n"),
        })) || [],
    };

    return payload;
  },
});

const upsertProfileAction = defineAction({
  input: profilePayloadSchema,
  async handler(input, context) {
    const session = await authenticateAction(context);

    await upsertProfile(session.user.id, input);

    if (context.site) {
      await revalidatePortfolioPage(context.site);
    }
  },
});

const revalidateProfileAction = defineAction({
  async handler(_, context) {
    await authenticateAction(context);

    if (context.site) {
      await revalidatePortfolioPage(context.site);
    }
  },
});

export const profileActions = {
  get: getProfileAction,
  upsert: upsertProfileAction,
  revalidate: revalidateProfileAction,
};
