import { Mono, Panel, pad } from "@/components/pages/landing/primitives";
import type { Project } from "@/data/portfolio";
import { ArrowUpRightIcon } from "lucide-react";

interface Props {
  projects: Project[];
}

function statusOf(project: Project) {
  if (project.url) return "En producción";
  if (project.repoUrl) return "Código abierto";
  return "Privado";
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const tags = project.tags ?? [];

  return (
    <Panel className="hover:border-primary/60 flex flex-col transition-colors duration-150 ease-out">
      <div className="border-border flex items-center justify-between gap-3 border-b px-4 py-2">
        <Mono className="text-primary">{pad(index + 1)}</Mono>
        <Mono className="text-muted-foreground">{statusOf(project)}</Mono>
      </div>

      {project.image ? (
        <div className="border-border border-b">
          <img
            src={project.image}
            alt={project.imageAlt || project.title}
            className="h-44 w-full object-cover grayscale transition-[filter] duration-300 ease-out hover:grayscale-0"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="px-4 py-4">
        <h3 className="text-foreground text-lg font-semibold tracking-[-0.01em]">{project.title}</h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-pretty">{project.description}</p>
      </div>

      {tags.length > 0 ? (
        <div className="border-border border-t px-4 py-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <Mono className="text-muted-foreground">Stack</Mono>
            <ul className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <li key={tag} className="border-border/80 text-foreground border px-1.5 py-0.5">
                  <Mono>{tag}</Mono>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <div className="border-border mt-auto flex flex-wrap items-center gap-2 border-t px-4 py-3">
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="pressable border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] uppercase focus-visible:ring-1 focus-visible:outline-none"
          >
            Ver proyecto
            <ArrowUpRightIcon className="h-3 w-3" />
          </a>
        ) : null}
        {project.repoUrl ? (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="pressable border-border text-muted-foreground hover:border-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] uppercase focus-visible:ring-1 focus-visible:outline-none"
          >
            Código
            <ArrowUpRightIcon className="h-3 w-3" />
          </a>
        ) : null}
        {!project.url && !project.repoUrl ? (
          <Mono className="text-muted-foreground/70">Proyecto privado, sin enlace público</Mono>
        ) : null}
      </div>
    </Panel>
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
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
