import type { IconName } from "@/components/icons";
import { db } from "@/lib/db";
import { obfuscate } from "@/lib/obfuscation";
import { data as envData } from "./.env.data";

export interface ExperienceData {
  role: string;
  company: string;
  period: string;
  highlights: string[];
}

const mergeProfile = (profile: any) => {
  if (!profile) return envData.profile;

  return {
    ...envData.profile,
    ...profile,
    aboutParagraphs:
      profile.aboutParagraphs && profile.aboutParagraphs.length
        ? profile.aboutParagraphs
        : envData.profile.aboutParagraphs,
  };
};

export const getPortfolioData = async () => {
  const profile = await db.profile.findFirst();

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
    experience: envData.experience,
    technologies: envData.technologies,
    profile: profile,
    socialLinks: socialLinks.filter((link) => link.href),
  };
};

type PortfolioData = Awaited<ReturnType<typeof getPortfolioData>>;

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
