import { adminMiddleware } from "@/lib/auth/middleware";
import { profilePayloadSchema } from "@/lib/validators/profile";
import { findProfile, revalidatePortfolioPage, upsertProfile } from "@/service/profile";
import { createServerFn } from "@tanstack/react-start";

export const getProfileAction = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async ({ context: { user } }) => {
    const profile = await findProfile(user.id);
    if (!profile) return null;

    const { proyects, ...data } = profile;

    const payload = {
      ...data,
      experiences: data.experiences.map((exp) => ({
        title: exp.title,
        company: exp.company,
        location: exp.location,
        period: exp.period,
        highlights: (exp.highlights ?? []).join("\n\n"),
      })),
      projects: proyects.map((project) => ({ ...project, tags: [...(project.tags ?? [])] })),
    };

    return payload;
  });

export const upsertProfileAction = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(profilePayloadSchema)
  .handler(async ({ data: input, context: { user } }) => {
    await upsertProfile(user.id, input);
    await revalidatePortfolioPage();
  });

export const revalidateProfileAction = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .handler(async () => {
    await revalidatePortfolioPage();
  });
