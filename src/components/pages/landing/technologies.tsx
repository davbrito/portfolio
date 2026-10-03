import { Mono } from "@/components/pages/landing/primitives";
import type { TechnologyGroup } from "@/data/portfolio";
import { cn } from "@/lib/utils";

interface Props {
  technologies: TechnologyGroup[];
}

export const LEVEL_VALUE: Record<string, number> = {
  Principiante: 1,
  Intermedio: 2,
  Avanzado: 3,
  Experto: 4,
};

/** Avanzado o Experto: lo que se puede defender en una entrevista técnica. */
export function isCoreSkill(level: string) {
  return (LEVEL_VALUE[level] ?? 0) >= 3;
}

export default function Technologies({ technologies }: Props) {
  if (technologies.length === 0) return null;

  return (
    <div>
      <div className="border-border bg-border grid gap-px border sm:grid-cols-2 lg:grid-cols-3">
        {technologies.map((group) => {
          const skills = group.skills.toSorted((a, b) => (LEVEL_VALUE[b.level] ?? 0) - (LEVEL_VALUE[a.level] ?? 0));
          return (
            <div key={group.title} className="bg-background p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-foreground text-lg font-semibold">{group.title}</h3>
                <Mono className="text-muted-foreground/70">{skills.length}</Mono>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => {
                  const core = isCoreSkill(skill.level);
                  return (
                    <li
                      key={skill.name}
                      title={skill.level}
                      className={cn(
                        "inline-flex items-center gap-2 border px-2.5 py-1 text-sm",
                        core
                          ? "border-primary/50 bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      {skill.name}
                      <span className="sr-only">: {skill.level}</span>
                      {skill.level === "Experto" ? <span className="bg-primary h-1.5 w-1.5" aria-hidden /> : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
        <span className="inline-flex items-center gap-2">
          <span className="border-primary/50 bg-primary/10 h-3 w-3 border" aria-hidden /> Uso diario, nivel avanzado
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="bg-primary h-1.5 w-1.5" aria-hidden /> Experto
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="border-border h-3 w-3 border" aria-hidden /> Experiencia práctica
        </span>
      </p>
    </div>
  );
}
