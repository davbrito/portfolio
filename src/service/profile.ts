import "@tanstack/react-start/server-only";

import { db8 } from "@/lib/db8";
import type { ProfileWithRelations } from "@/lib/db8-rows";
import { siteUrl } from "@/lib/server-env";
import type { ProfilePayload } from "@/lib/validators/profile";
import { createServerOnlyFn } from "@tanstack/react-start";

export async function findProfile(userId: string) {
  const profile = await db8.orm.public.Profile.where({ userId })
    .include("experiences")
    .include("skills")
    .include("proyects", (q) => q.orderBy((p) => p.order.asc()))
    .first();

  return profile as unknown as ProfileWithRelations | null;
}

export async function exportProfileYaml(userId: string) {
  const { stringify } = await import("yaml");

  const profile = await findProfile(userId);

  if (!profile) return null;

  const { userId: _userId, experiences, skills, proyects, ...profileData } = profile;

  return stringify({
    ...profileData,
    experiences: experiences.map(({ id: _id, profileId: _profileId, ...exp }) => exp),
    skills: skills.map(({ id: _id, profileId: _profileId, ...skill }) => skill),
    projects: proyects.map(({ id: _id, profileId: _profileId, ...project }) => project),
  });
}

export async function upsertProfile(userId: string, data: ProfilePayload) {
  const { experiences, skills, projects, ...profileData } = data;

  const cleanedExperiences = experiences.map((exp) => ({
    ...exp,
    highlights: exp.highlights
      .split(/[\r\n]+/)
      .map((item) => item.trim())
      .filter(Boolean),
  }));

  const cleanedSkills = skills.filter((skill) =>
    [skill.name, skill.level, skill.group].some((value) => value.length > 0),
  );

  const cleanedProjects = projects
    .map((project) => ({
      ...project,
      tags: project.tags.map((tag) => tag.trim()).filter(Boolean),
    }))
    .filter((project) => [project.title, project.description].some((value) => value.length > 0));

  await db8.transaction(async (tx) => {
    await tx.orm.public.Profile.upsert({
      create: { ...profileData, userId },
      update: { ...profileData },
    });

    const profileId = userId;

    await tx.orm.public.Experience.where({ profileId }).delete();
    if (cleanedExperiences.length > 0) {
      await tx.orm.public.Experience.createAll(cleanedExperiences.map((exp) => ({ ...exp, profileId })));
    }

    await tx.orm.public.Skills.where({ profileId }).delete();
    if (cleanedSkills.length > 0) {
      await tx.orm.public.Skills.createAll(cleanedSkills.map((skill) => ({ ...skill, profileId })));
    }

    await tx.orm.public.Proyects.where({ profileId }).delete();
    if (cleanedProjects.length > 0) {
      await tx.orm.public.Proyects.createAll(
        cleanedProjects.map((project, index) => ({ ...project, profileId, order: index })),
      );
    }
  });
}

export const revalidatePortfolioPage = createServerOnlyFn(async () => {
  const urlsToRevalidate = ["/"].map((path) => new URL(path, siteUrl));

  for (const url of urlsToRevalidate) {
    console.log("Revalidating ISR for", url.href);
    await fetch(url, {
      method: "HEAD",
      headers: { "x-prerender-revalidate": process.env.ISR_BYPASS_TOKEN! },
    });
  }
});
