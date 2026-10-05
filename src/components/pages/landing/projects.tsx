import { Mono, Panel, pad } from "@/components/pages/landing/primitives";
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon, LockIcon } from "lucide-react";

interface Props {
  projects: Project[];
}

function statusOf(project: Project) {
  if (project.url) return "En producción";
  if (project.repoUrl) return "Código abierto";
  return "Privado";
}

function ProjectCard({ project, index, featured }: { project: Project; index: number; featured: boolean }) {
  const tags = project.tags ?? [];
  // La rejilla imagen | texto sólo tiene sentido si hay imagen; sin ella el
  // texto ocuparía una única columna de las 12.
  const split = featured && Boolean(project.image);

  return (
    <article
      className={cn(
        "project-card border-border bg-card hover:border-primary/60 group flex flex-col overflow-hidden border transition-colors duration-200",
        featured && "lg:col-span-2",
        split && "lg:grid lg:grid-cols-12",
      )}
    >
      {project.image ? (
        <div
          className={cn(
            "project-media border-border relative overflow-hidden border-b",
            split ? "aspect-video lg:col-span-7 lg:aspect-auto lg:border-r lg:border-b-0" : "aspect-video",
          )}
        >
          <img
            src={project.image}
            alt={project.imageAlt || project.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className={cn("flex flex-1 flex-col p-5 md:p-6", split && "lg:col-span-5")}>
        <div className="flex items-center justify-between gap-3">
          <Mono className="text-primary">
            {pad(index + 1)}
            {featured ? " · Destacado" : null}
          </Mono>
          <Mono className="text-muted-foreground inline-flex items-center gap-1.5">
            {!project.url && !project.repoUrl ? <LockIcon className="h-3 w-3" aria-hidden /> : null}
            {statusOf(project)}
          </Mono>
        </div>

        <h3
          className={cn(
            "font-display text-foreground mt-4 font-semibold tracking-[-0.02em]",
            featured ? "text-2xl md:text-3xl" : "text-xl",
          )}
        >
          {project.title}
        </h3>
        <p className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-relaxed text-pretty">
          {project.description}
        </p>

        {tags.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tecnologías">
            {tags.map((tag) => (
              <li key={tag} className="bg-secondary text-foreground/90 px-2 py-0.5 font-mono text-xs">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="pressable bg-primary text-primary-foreground hover:bg-primary/85 focus-visible:ring-ring inline-flex h-9 items-center gap-1.5 px-3.5 text-sm font-medium focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Ver en vivo
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="pressable border-border text-foreground hover:border-foreground focus-visible:ring-ring inline-flex h-9 items-center gap-1.5 border px-3.5 text-sm font-medium focus-visible:ring-1 focus-visible:outline-none"
            >
              Código
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {!project.url && !project.repoUrl ? (
            <span className="text-muted-foreground text-sm">Proyecto privado, sin enlace público</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function Projects({ projects }: Props) {
  if (projects.length === 0) {
    return (
      <Panel className="px-6 py-10 text-center">
        <Mono className="text-muted-foreground">Pronto: una selección de proyectos en los que he trabajado</Mono>
      </Panel>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} featured={index === 0} />
      ))}
    </div>
  );
}
