/**
 * Clasificación de tecnologías por capa lógica.
 *
 * El landing presenta el stack como una matriz de infraestructura y los
 * proyectos como fichas técnicas con su flujo de datos. Ambas vistas derivan
 * la capa desde el nombre de la tecnología (tag o skill) para no depender de
 * campos nuevos en la base de datos.
 */

export const LAYERS = [
  { id: "client", code: "L1", name: "Cliente", scope: "Interfaz · Render · Estado" },
  { id: "service", code: "L2", name: "Lógica", scope: "Servicios · API · Dominio" },
  { id: "data", code: "L3", name: "Datos", scope: "Persistencia · Consultas · Caché" },
  { id: "infra", code: "L4", name: "Infra", scope: "Build · Deploy · Observabilidad" },
] as const;

export type LayerId = (typeof LAYERS)[number]["id"];

export type Layer = (typeof LAYERS)[number];

const LAYER_KEYWORDS: Record<LayerId, string[]> = {
  client: [
    "react",
    "next",
    "vue",
    "svelte",
    "angular",
    "astro",
    "remix",
    "tanstack",
    "vite",
    "html",
    "css",
    "tailwind",
    "sass",
    "scss",
    "shadcn",
    "ui",
    "frontend",
    "front-end",
    "cliente",
    "browser",
    "dom",
    "redux",
    "zustand",
    "framer",
    "figma",
    "accesibilidad",
    "a11y",
    "responsive",
    "diseño",
    "mobile",
    "react native",
    "expo",
    "flutter",
  ],
  service: [
    "node",
    "express",
    "nest",
    "fastify",
    "hono",
    "trpc",
    "graphql",
    "api",
    "rest",
    "python",
    "django",
    "flask",
    "fastapi",
    "go",
    "golang",
    "rust",
    "java",
    "spring",
    "php",
    "laravel",
    "ruby",
    "rails",
    "backend",
    "back-end",
    "servidor",
    "server",
    "auth",
    "oauth",
    "jwt",
    "zod",
    "websocket",
    "socket",
    "typescript",
    "javascript",
    "c#",
    ".net",
    "microservicio",
    "cola",
    "queue",
    "cron",
    "bun",
    "deno",
  ],
  data: [
    "postgre",
    "postgres",
    "mysql",
    "mariadb",
    "sqlite",
    "mongo",
    "redis",
    "prisma",
    "drizzle",
    "sequelize",
    "typeorm",
    "supabase",
    "firebase",
    "neon",
    "planetscale",
    "sql",
    "nosql",
    "datos",
    "database",
    "base de datos",
    "elastic",
    "clickhouse",
    "s3",
    "r2",
    "storage",
    "etl",
    "cache",
  ],
  infra: [
    "docker",
    "kubernetes",
    "k8s",
    "aws",
    "gcp",
    "azure",
    "vercel",
    "netlify",
    "cloudflare",
    "nginx",
    "linux",
    "ci",
    "cd",
    "github actions",
    "gitlab",
    "terraform",
    "ansible",
    "serverless",
    "edge",
    "infra",
    "devops",
    "monitor",
    "observab",
    "sentry",
    "grafana",
    "prometheus",
    "git",
    "pnpm",
    "turbo",
    "webpack",
    "esbuild",
    "test",
    "vitest",
    "jest",
    "playwright",
    "cypress",
  ],
};

/** Devuelve la capa lógica de una tecnología. Sin coincidencia → `service`. */
export function classifyTech(name: string): LayerId {
  const value = name.toLowerCase().trim();

  for (const layer of LAYERS) {
    if (LAYER_KEYWORDS[layer.id].some((keyword) => value.includes(keyword))) return layer.id;
  }

  return "service";
}

export function getLayer(id: LayerId): Layer {
  return LAYERS.find((layer) => layer.id === id) ?? LAYERS[1];
}

/** Orden de las capas para ordenar filas de la matriz. */
export function layerIndex(id: LayerId): number {
  return LAYERS.findIndex((layer) => layer.id === id);
}

/** Capas cubiertas por un conjunto de tecnologías, en orden de flujo. */
export function layersOf(tags: readonly string[] | null | undefined): Layer[] {
  const found = new Set<LayerId>((tags ?? []).map(classifyTech));
  return LAYERS.filter((layer) => found.has(layer.id));
}

/** `01`, `02`, … para identificadores de sistema y numeración de listas. */
export function pad(value: number, size = 2): string {
  return value.toString().padStart(size, "0");
}
