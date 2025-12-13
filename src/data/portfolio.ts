import type { IconName } from "@/components/icons";

export interface ExperienceData {
  role: string;
  company: string;
  period: string;
  highlights: string[];
}

export const getPortfolioData = async () =>
  import("./" + ".env.data.ts")
    .then((module) => module.data)
    .catch((): typeof import("./.env.data.ts").data => ({
      socialLinks: [],
      experience: [],
      technologies: [],
      profile: {
        name: "Placeholder Name",
        title: "Developer",
        aboutImage: "https://placehold.co/300",
        aboutImageAlt: "Placeholder Image",
        location: "Unknown",
        experience: "0 years",
        description: "No description available.",
        brief: "No brief available.",
        aboutParagraphs: [
          "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        ],
      },
    }));

type PortfolioData = Awaited<ReturnType<typeof getPortfolioData>>;

export type Profile = PortfolioData["profile"];

export interface SocialLink {
  label: string;
  href: string;
  icon: IconName;
}

export type TechnologyGroup = PortfolioData["technologies"][number];
