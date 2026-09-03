/**
 * Row shapes for db8 queries that use `.include(...)`. That method's row
 * type doesn't resolve on this orm-postgres rc (namespaced accessor path) —
 * every field decays to `unknown`/`any` — so callers cast the query result
 * against these hand-written shapes instead, matching prisma8/contract.prisma.
 */

export interface ExperienceRow {
  id: string;
  profileId: string;
  title: string;
  company: string;
  location: string;
  period: string;
  highlights: readonly string[] | null;
}

export interface SkillsRow {
  id: string;
  profileId: string;
  name: string;
  level: string;
  group: string;
}

export interface ProyectsRow {
  id: string;
  profileId: string;
  title: string;
  description: string;
  url: string | null;
  repoUrl: string | null;
  image: string | null;
  imageAlt: string | null;
  tags: readonly string[] | null;
  order: number;
}

export interface ProfileWithRelations {
  userId: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  description: string;
  brief: string;
  aboutImage: string | null;
  aboutImageAlt: string;
  aboutText: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  email: string | null;
  active: boolean;
  experiences: ExperienceRow[];
  skills: SkillsRow[];
  proyects: ProyectsRow[];
}
