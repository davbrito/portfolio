import { Mono, Panel, PanelHeader, TechLink } from "@/components/pages/landing/primitives";
import { classifyTech, getLayer, layersOf, pad } from "@/components/pages/landing/tech-layers";
import type { Project } from "@/data/portfolio";
import { ArrowUpRightIcon } from "lucide-react";

interface Props {
  projects: Project[];
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const tags = project.tags ?? [];
  const layers = layersOf(tags);
  const status = project.url ? "En producción" : project.repoUrl ? "Código abierto" : "Interno";

  return (
    <Panel className="hover:border-primary/60 flex flex-col transition-colors duration-150 ease-out">
      <PanelHeader id={`SYS-${pad(index + 1)}`} title={`proyecto/${slugify(project.title)}`} meta={status} />

      {project.image ? (
        <div className="border-border border-b">
          <img
            src={project.image}
            alt={project.imageAlt || project.title}
            className="h-40 w-full object-cover grayscale transition-[filter] duration-300 ease-out hover:grayscale-0"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="border-border border-b px-4 py-4">
        <h3 className="text-foreground text-base font-semibold tracking-[-0.01em]">{project.title}</h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-pretty">{project.description}</p>
      </div>

      {/* Arquitectura de flujo de datos, derivada del stack declarado */}
      <div className="border-border border-b px-4 py-3">
        <Mono className="text-muted-foreground">Flujo de datos</Mono>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          {layers.length > 0 ? (
            layers.map((layer, position) => (
              <span key={layer.id} className="flex items-center gap-2">
                {position > 0 ? (
                  <span className="text-muted-foreground/60 font-mono text-[10px]" aria-hidden>
                    ─▶
                  </span>
                ) : null}
                <span className="border-border inline-flex items-center gap-1.5 border px-1.5 py-0.5">
                  <Mono className="text-primary">{layer.code}</Mono>
                  <Mono className="text-foreground">{layer.name}</Mono>
                </span>
              </span>
            ))
          ) : (
            <Mono className="text-muted-foreground/70">Sin stack declarado</Mono>
          )}
        </div>
      </div>

      {/* Parámetros cuantificables */}
      <dl className="divide-border border-border grid grid-cols-3 divide-x border-b">
        <div className="px-4 py-3">
          <dt>
            <Mono className="text-muted-foreground">Capas</Mono>
          </dt>
          <dd className="text-foreground mt-1 font-mono text-sm tabular-nums">
            {layers.length}
            <span className="text-muted-foreground/60">/4</span>
          </dd>
        </div>
        <div className="px-4 py-3">
          <dt>
            <Mono className="text-muted-foreground">Módulos</Mono>
          </dt>
          <dd className="text-foreground mt-1 font-mono text-sm tabular-nums">{pad(tags.length)}</dd>
        </div>
        <div className="px-4 py-3">
          <dt>
            <Mono className="text-muted-foreground">Índice</Mono>
          </dt>
          <dd className="text-foreground mt-1 font-mono text-sm tabular-nums">{pad(project.order ?? index + 1)}</dd>
        </div>
      </dl>

      {tags.length > 0 ? (
        <ul className="border-border flex flex-wrap gap-1.5 border-b px-4 py-3">
          {tags.map((tag) => (
            <li
              key={tag}
              className="border-border/80 text-muted-foreground inline-flex items-center gap-1.5 border px-1.5 py-0.5"
            >
              <span className="bg-primary/60 h-1 w-1" aria-hidden />
              <Mono title={`Capa ${getLayer(classifyTech(tag)).name}`}>{tag}</Mono>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3">
        {project.url ? (
          <TechLink href={project.url} target="_blank" rel="noreferrer">
            Ejecutar
            <ArrowUpRightIcon className="h-3 w-3" />
          </TechLink>
        ) : null}
        {project.repoUrl ? (
          <TechLink href={project.repoUrl} target="_blank" rel="noreferrer" className="text-muted-foreground">
            Código fuente
            <ArrowUpRightIcon className="h-3 w-3" />
          </TechLink>
        ) : null}
        {!project.url && !project.repoUrl ? <Mono className="text-muted-foreground/70">Acceso restringido</Mono> : null}
      </div>
    </Panel>
  );
}

export default function Projects({ projects }: Props) {
  if (projects.length === 0) {
    return (
      <Panel className="px-6 py-10 text-center">
        <Mono className="text-muted-foreground">
          Catálogo en preparación · próximas fichas técnicas en construcción
        </Mono>
      </Panel>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
