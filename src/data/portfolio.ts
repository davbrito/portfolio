import type { IconName } from "@/components/icons";
import { db } from "@/lib/db";
import { createObfuscationKey, obfuscate, serializeObfuscationKey } from "@/lib/obfuscation";
import { createServerFn } from "@tanstack/react-start";

export const getPortfolioData = createServerFn().handler(async () => {
  const profile = await db.profile.findFirst({
    include: { experiences: true, skills: true, projects: { orderBy: { order: "asc" } } },
  });

  if (!profile) return null;

  const obKey = await createObfuscationKey();

  const socialLinks: SocialLink[] = [
    {
      icon: "github",
      href: profile?.githubUrl || "",
      label: "GitHub",
    },
    {
      icon: "linkedin",
      href: profile?.linkedinUrl || "",
      label: "LinkedIn",
    },
  ];

  if (profile?.email) {
    const value = await obfuscate(`mailto:${profile.email}`, obKey);
    socialLinks.push({
      icon: "mail",
      href: value,
      label: "Email",
      obfuscated: true,
      obfuscationTarget: "href",
    });
  }

  return {
    obKey: await serializeObfuscationKey(obKey),
    profile: profile,
    experience: profile?.experiences || [],
    projects: profile?.projects || [],
    technologies: Map.groupBy(profile?.skills || [], (skill) => skill.group || "Otros")
      .entries()
      .map(([group, skills]) => ({
        title: group,
        skills: skills.map((skill) => ({ name: skill.name, level: skill.level })),
      }))
      .toArray(),
    socialLinks: socialLinks.filter((link) => link.href),
  };
});

export type PortfolioData = NonNullable<Awaited<ReturnType<typeof getPortfolioData>>>;

export type Profile = PortfolioData["profile"];

export interface SocialLink {
  label: string;
  href: string;
  icon: IconName;
  obfuscated?: boolean;
  obfuscationTarget?: string;
}

export type TechnologyGroup = PortfolioData["technologies"][number];

export type Project = PortfolioData["projects"][number];
