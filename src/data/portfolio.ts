import type { IconName } from "@/components/icons";
import { db8 } from "@/lib/db8";
import type { ProfileWithRelations } from "@/lib/db8-rows";
import { createObfuscationKey, obfuscate, serializeObfuscationKey } from "@/lib/obfuscation";
import { createServerFn } from "@tanstack/react-start";

export const getPortfolioData = createServerFn().handler(async () => {
  const result = await db8.orm.public.Profile.include("experiences")
    .include("skills")
    .include("proyects", (q) => q.orderBy((p) => p.order.asc()))
    .first();

  const profile = result as unknown as ProfileWithRelations | null;

  if (!profile) return null;

  const { experiences, proyects, skills } = profile;

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
    experience: experiences,
    projects: proyects,
    technologies: Map.groupBy(skills, (skill) => skill.group || "Otros")
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

export type ExperienceItem = PortfolioData["experience"][number];
