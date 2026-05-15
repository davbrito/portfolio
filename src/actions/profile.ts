import { adminMiddleware } from "@/lib/auth/middleware";
import { profilePayloadSchema } from "@/lib/validators/profile";
import { findProfile, revalidatePortfolioPage, upsertProfile } from "@/service/profile";
import { createServerFn } from "@tanstack/react-start";

const getProfileAction = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async ({ context: { user } }) => {
    const data = await findProfile(user.id);
    if (!data) return null;

    const payload = {
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
  });

const upsertProfileAction = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(profilePayloadSchema)
  .handler(async ({ data: input, context: { user } }) => {
    await upsertProfile(user.id, input);
    await revalidatePortfolioPage();
  });

const revalidateProfileAction = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .handler(async () => {
    await revalidatePortfolioPage();
  });

export const profileActions = {
  get: getProfileAction,
  upsert: upsertProfileAction,
  revalidate: revalidateProfileAction,
};
