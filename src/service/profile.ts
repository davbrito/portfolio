import { db } from "@/lib/db";
import type { ProfilePayload } from "@/lib/validators/profile";

export async function findProfile(userId: string) {
  const profile = await db.profile.findUnique({
    where: { userId },
    include: { experiences: true, skills: true },
  });

  return profile;
}

export async function upsertProfile(userId: string, data: ProfilePayload) {
  const { experiences, skills, ...profileData } = data;

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

  const profile = await db.$transaction(async (tx) => {
    const savedProfile = await tx.profile.upsert({
      where: { userId },
      update: {
        ...profileData,
      },
      create: {
        ...profileData,
        user: { connect: { id: userId } },
      },
    });

    await tx.experience.deleteMany({ where: { userId } });
    if (cleanedExperiences.length > 0) {
      await tx.experience.createMany({
        data: cleanedExperiences.map((exp) => ({
          ...exp,
          userId,
        })),
      });
    }

    await tx.skills.deleteMany({ where: { userId } });
    if (cleanedSkills.length > 0) {
      await tx.skills.createMany({
        data: cleanedSkills.map((skill) => ({
          ...skill,
          userId,
        })),
      });
    }

    return savedProfile;
  });

  return {
    active: profile.active,
    name: profile.name,
    title: profile.title,
    location: profile.location,
    experience: profile.experience,
    description: profile.description,
    brief: profile.brief,
    aboutText: profile.aboutText,
    aboutImage: profile.aboutImage ?? null,
    aboutImageAlt: profile.aboutImageAlt,
    githubUrl: profile.githubUrl ?? null,
    linkedinUrl: profile.linkedinUrl ?? null,
    email: profile.email ?? null,
    experiences: cleanedExperiences.map((exp) => ({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      period: exp.period,
      highlights: exp.highlights.join("\n"),
    })),
    skills: cleanedSkills.map((skill) => ({
      name: skill.name,
      level: skill.level,
      group: skill.group,
    })),
  };
}
