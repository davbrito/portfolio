import * as z from "astro/zod";

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
      .url({ message: "URL inválida" })
      .max(2 * 1024 * 1024)
      .nullable(),
  ),
  aboutImageAlt: z
    .string()
    .trim()
    .max(200, { message: "El texto alternativo es muy largo" })
    .nullish()
    .transform((val) => val || ""),
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
    .pipe(z.string().trim().email({ message: "Email inválido" }).max(500).nullable()),
});

export type ProfilePayload = z.infer<typeof profilePayloadSchema>;
export type ProfilePayloadInput = z.input<typeof profilePayloadSchema>;
