import type { IconName } from "@/components/icons";
import { db } from "@/lib/db";
import { obfuscate } from "@/lib/obfuscation";

export async function getPortfolioData() {
  const profile = await db.profile.findFirst({
    include: { experiences: true, skills: true, projects: true },
  });

  if (!profile) return null;

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
    const { value, key } = await obfuscate(`mailto:${profile.email}`);
    socialLinks.push({
      icon: "mail",
      href: value,
      label: "Email",
      obfuscated: true,
      obfuscationKey: key,
      obfuscationTarget: "href",
    });
  }

  return {
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
}

export type PortfolioData = NonNullable<Awaited<ReturnType<typeof getPortfolioData>>>;

export type Profile = PortfolioData["profile"];

export interface SocialLink {
  label: string;
  href: string;
  icon: IconName;
  obfuscated?: boolean;
  obfuscationKey?: string;
  obfuscationTarget?: string;
}

export type TechnologyGroup = PortfolioData["technologies"][number];

export type Project = PortfolioData["projects"][number];
