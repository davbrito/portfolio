import "@tanstack/react-start/server-only";

import { db8 } from "@/lib/db8";
import type { ProfileWithRelations } from "@/lib/db8-rows";
import { ADMIN_EMAIL, siteUrl } from "@/lib/server-env";
import { getStorageObject, putStorageObject } from "@/lib/storage";
import { storedProfileDataSchema, type ProfilePayload, type StoredProfileData } from "@/lib/validators/profile";
import { createServerOnlyFn } from "@tanstack/react-start";
import deburr from "lodash-es/deburr.js";
import kebabCase from "lodash-es/kebabCase.js";
import { createHash } from "node:crypto";
import { parse, stringify } from "yaml";

export type { StoredProfileData };

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) throw new Error("Invalid data URL format");
  const contentType = match[1];
  const buffer = Buffer.from(match[2], "base64");
  return { contentType, buffer };
}

function computeHash6(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex").slice(0, 6);
}

function getExtension(contentType: string): string {
  if (contentType === "image/jpeg" || contentType === "image/jpg") return "jpeg";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/png") return "png";
  if (contentType === "image/gif") return "gif";
  if (contentType === "image/svg+xml") return "svg";
  return "bin";
}

function toSafeSlug(str: string): string {
  return kebabCase(deburr(str)) || "item";
}

export async function getProfileFromStorage(): Promise<StoredProfileData | null> {
  try {
    const upstream = await getStorageObject("profile/data.yaml");
    if (!upstream.ok) return null;
    const text = await upstream.text();
    const raw = parse(text);
    return storedProfileDataSchema.parse(raw);
  } catch (error) {
    console.error("Error reading profile/data.yaml from storage:", error);
    return null;
  }
}

export async function findProfile(userId?: string): Promise<ProfileWithRelations | null> {
  const stored = await getProfileFromStorage();
  if (!stored) return null;

  let resolvedUserId = userId;
  if (!resolvedUserId) {
    try {
      const admin = await db8.orm.public.Users.where({ email: ADMIN_EMAIL }).first();
      resolvedUserId = admin?.id ?? "";
    } catch {
      resolvedUserId = "";
    }
  }

  return {
    userId: resolvedUserId,
    name: stored.name ?? "",
    title: stored.title ?? "",
    location: stored.location ?? "",
    experience: stored.experience ?? "",
    description: stored.description ?? "",
    brief: stored.brief ?? "",
    aboutImage: stored.aboutImage ?? null,
    aboutImageAlt: stored.aboutImageAlt ?? "",
    aboutText: stored.aboutText ?? "",
    githubUrl: stored.githubUrl ?? null,
    linkedinUrl: stored.linkedinUrl ?? null,
    email: stored.email ?? null,
    active: stored.active ?? false,
    experiences: (stored.experiences ?? []).map((exp, index) => ({
      id: `exp-${index}`,
      profileId: resolvedUserId,
      title: exp.title ?? "",
      company: exp.company ?? "",
      location: exp.location ?? "",
      period: exp.period ?? "",
      highlights: exp.highlights ?? [],
    })),
    skills: (stored.skills ?? []).map((skill, index) => ({
      id: `skill-${index}`,
      profileId: resolvedUserId,
      name: skill.name ?? "",
      level: skill.level ?? "",
      group: skill.group ?? "",
    })),
    proyects: (stored.projects ?? []).map((project, index) => ({
      id: `proj-${index}`,
      profileId: resolvedUserId,
      title: project.title ?? "",
      description: project.description ?? "",
      url: project.url ?? null,
      repoUrl: project.repoUrl ?? null,
      image: project.image ?? null,
      imageAlt: project.imageAlt ?? null,
      tags: project.tags ?? [],
      order: index,
    })),
  };
}

export async function exportProfileYaml(_userId?: string): Promise<string | null> {
  try {
    const upstream = await getStorageObject("profile/data.yaml");
    if (!upstream.ok) return null;
    return await upstream.text();
  } catch (error) {
    console.error("Error exporting profile YAML from storage:", error);
    return null;
  }
}

export async function upsertProfile(_userId: string, data: ProfilePayload) {
  const { experiences, skills, projects, ...profileData } = data;

  let aboutImage = profileData.aboutImage;
  if (aboutImage && aboutImage.startsWith("data:")) {
    const { contentType, buffer } = parseDataUrl(aboutImage);
    const ext = getExtension(contentType);
    const hash = computeHash6(buffer);
    // Deterministic: entity "profile", property "aboutImage", 6-char hash for cache-busting
    const filename = `profile-about-image-${hash}.${ext}`;
    const storageKey = `profile/assets/${filename}`;
    const res = await putStorageObject(storageKey, buffer, { "Content-Type": contentType });
    if (!res.ok) {
      throw new Error(`Failed to upload asset ${filename} to storage`);
    }
    aboutImage = `/profile/assets/${filename}`;
  }

  const cleanedExperiences = experiences.map((exp) => ({
    title: exp.title,
    company: exp.company,
    location: exp.location,
    period: exp.period,
    highlights:
      typeof exp.highlights === "string"
        ? exp.highlights
            .split(/[\r\n]+/)
            .map((item) => item.trim())
            .filter(Boolean)
        : (exp.highlights ?? []),
  }));

  const cleanedSkills = skills.filter((skill) =>
    [skill.name, skill.level, skill.group].some((value) => value.length > 0),
  );

  const cleanedProjects = [];
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    if (!project.title && !project.description) continue;

    let image = project.image;
    if (image && image.startsWith("data:")) {
      const { contentType, buffer } = parseDataUrl(image);
      const ext = getExtension(contentType);
      const hash = computeHash6(buffer);
      // Deterministic: entity "project-{slug}", property "image", 6-char hash for cache-busting
      const slug = toSafeSlug(project.title || `project-${i}`);
      const filename = `project-${slug}-image-${hash}.${ext}`;
      const storageKey = `profile/assets/${filename}`;
      const res = await putStorageObject(storageKey, buffer, { "Content-Type": contentType });
      if (!res.ok) {
        throw new Error(`Failed to upload asset ${filename} to storage`);
      }
      image = `/profile/assets/${filename}`;
    }

    cleanedProjects.push({
      title: project.title,
      description: project.description,
      url: project.url || null,
      repoUrl: project.repoUrl || null,
      image,
      imageAlt: project.imageAlt || null,
      tags: project.tags.map((tag) => tag.trim()).filter(Boolean),
    });
  }

  const storedData: StoredProfileData = {
    ...profileData,
    aboutImage,
    experiences: cleanedExperiences,
    skills: cleanedSkills,
    projects: cleanedProjects,
  };

  const yamlContent = stringify(storedData);
  const res = await putStorageObject("profile/data.yaml", yamlContent, {
    "Content-Type": "application/yaml; charset=utf-8",
  });

  if (!res.ok) {
    throw new Error("Failed to save profile/data.yaml to storage");
  }

  await revalidatePortfolioPage();
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
