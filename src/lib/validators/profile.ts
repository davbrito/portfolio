import * as z from "zod";

export const SKILL_LEVELS = ["Principiante", "Intermedio", "Avanzado", "Experto"] as const;

const skillLevelSchema = z
  .string()
  .nonempty({ error: "El nivel no puede estar vacío" })
  .pipe(z.enum(SKILL_LEVELS, { error: "Nivel de habilidad inválido" }));

const experienceItemSchema = z.object({
  title: z
    .string()
    .trim()
    .max(120, { error: "El cargo es muy largo" })
    .nullish()
    .transform((val) => val || ""),
  company: z
    .string()
    .trim()
    .max(120, { error: "La empresa es muy larga" })
    .nullish()
    .transform((val) => val || ""),
  location: z
    .string()
    .trim()
    .max(120, { error: "La ubicación es muy larga" })
    .nullish()
    .transform((val) => val || ""),
  period: z
    .string()
    .trim()
    .max(120, { error: "El periodo es muy largo" })
    .nullish()
    .transform((val) => val || ""),
  highlights: z.string().trim().default(""),
});

const skillItemSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty({ error: "El nombre no puede estar vacío" })
    .max(120, { error: "El nombre es muy largo" }),
  level: skillLevelSchema,
  group: z
    .string()
    .trim()
    .nonempty({ error: "El grupo no puede estar vacío" })
    .max(120, { error: "El grupo es muy largo" }),
});

const isValidImageSource = (val: string) =>
  val.startsWith("/") || val.startsWith("data:") || URL.canParse(val);

const projectItemSchema = z.object({
  title: z
    .string()
    .trim()
    .nullish()
    .transform((val) => val || ""),
  description: z
    .string()
    .trim()
    .nullish()
    .transform((val) => val || ""),
  url: z
    .string()
    .trim()
    .nullable()
    .transform((val) => val || null)
    .pipe(z.url({ error: "URL inválida" }).max(500).nullable()),
  repoUrl: z
    .string()
    .trim()
    .nullable()
    .transform((val) => val || null)
    .pipe(z.url({ error: "URL inválida" }).max(500).nullable()),
  // URL externa, ruta relativa (ej. /profile/assets/...) o data URL subida desde el admin.
  image: z
    .string()
    .trim()
    .nullable()
    .transform((val) => val || null)
    .pipe(
      z
        .string()
        .max(2 * 1024 * 1024)
        .refine(isValidImageSource, { message: "URL o ruta de imagen inválida" })
        .nullable(),
    ),
  imageAlt: z
    .string()
    .trim()
    .max(200, { error: "El texto alternativo es muy largo" })
    .nullish()
    .transform((val) => val || ""),
  tags: z.array(z.string().trim().nonempty({ error: "La etiqueta no puede estar vacía" })).default([]),
});

export const profilePayloadSchema = z.object({
  active: z.boolean().default(false),
  name: z
    .string()
    .trim()
    .max(120, { message: "El nombre es muy largo" })
    .nullish()
    .transform((val) => val || ""),
  title: z
    .string()
    .trim()
    .max(120, { message: "El título es muy largo" })
    .nullish()
    .transform((val) => val || ""),
  location: z
    .string()
    .trim()
    .max(120, { message: "La ubicación es muy larga" })
    .nullish()
    .transform((val) => val || ""),
  experience: z
    .string()
    .trim()
    .max(120, { message: "La experiencia es muy larga" })
    .nullish()
    .transform((val) => val || ""),
  description: z
    .string()
    .trim()
    .max(500, { message: "La descripción es muy larga" })
    .nullish()
    .transform((val) => val || ""),
  brief: z
    .string()
    .trim()
    .max(320, { message: "El resumen es muy largo" })
    .nullish()
    .transform((val) => val || ""),
  aboutText: z
    .string()
    .trim()
    .nullish()
    .transform((val) => val || ""),
  aboutImage: z.preprocess(
    (value) => value || null,
    z
      .string()
      .trim()
      .max(2 * 1024 * 1024)
      .refine(isValidImageSource, { message: "URL o ruta de imagen inválida" })
      .nullable(),
  ),
  aboutImageAlt: z
    .string()
    .trim()
    .max(200, { error: "El texto alternativo es muy largo" })
    .nullish()
    .transform((val) => val || ""),
  experiences: z.array(experienceItemSchema).default([]),
  skills: z.array(skillItemSchema).default([]),
  projects: z.array(projectItemSchema).default([]),
  githubUrl: z
    .string()
    .trim()
    .nullable()
    .transform((val) => val || null)
    .pipe(z.string().trim().url({ message: "URL de GitHub inválida" }).max(500).nullable()),
  linkedinUrl: z
    .string()
    .trim()
    .nullable()
    .transform((val) => val || null)
    .pipe(z.string().url({ message: "URL de LinkedIn inválida" }).max(500).nullable()),
  email: z
    .string()
    .trim()
    .nullable()
    .transform((val) => val || null)
    .pipe(z.email({ error: "Email inválido" }).trim().max(500).nullable()),
});

export type ProfilePayload = z.infer<typeof profilePayloadSchema>;
export type ProfilePayloadInput = z.input<typeof profilePayloadSchema>;

export const storedExperienceSchema = z.object({
  title: z.string().default(""),
  company: z.string().default(""),
  location: z.string().default(""),
  period: z.string().default(""),
  highlights: z.array(z.string()).default([]),
});

export const storedSkillSchema = z.object({
  name: z.string().default(""),
  level: z.string().default(""),
  group: z.string().default(""),
});

export const storedProjectSchema = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
  url: z.string().nullable().default(null),
  repoUrl: z.string().nullable().default(null),
  image: z.string().nullable().default(null),
  imageAlt: z.string().nullable().default(null),
  tags: z.array(z.string()).default([]),
});

export const storedProfileDataSchema = z.object({
  name: z.string().default(""),
  title: z.string().default(""),
  location: z.string().default(""),
  experience: z.string().default(""),
  description: z.string().default(""),
  brief: z.string().default(""),
  aboutText: z.string().default(""),
  aboutImage: z.string().nullable().default(null),
  aboutImageAlt: z.string().default(""),
  githubUrl: z.string().nullable().default(null),
  linkedinUrl: z.string().nullable().default(null),
  email: z.string().nullable().default(null),
  active: z.boolean().default(false),
  experiences: z.array(storedExperienceSchema).default([]),
  skills: z.array(storedSkillSchema).default([]),
  projects: z.array(storedProjectSchema).default([]),
});

export type StoredProfileData = z.infer<typeof storedProfileDataSchema>;

