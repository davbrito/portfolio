import { authenticateAction } from "@/lib/auth/actions";
import { profilePayloadSchema, type ProfilePayloadInput } from "@/lib/validators/profile";
import { findProfile, revalidatePortfolioPage, upsertProfile } from "@/service/profile";
import { defineAction } from "astro:actions";

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
