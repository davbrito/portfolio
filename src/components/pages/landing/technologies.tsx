import { Meter, Mono } from "@/components/pages/landing/primitives";
import type { TechnologyGroup } from "@/data/portfolio";

interface Props {
  technologies: TechnologyGroup[];
}

const LEVEL_VALUE: Record<string, number> = {
  Principiante: 1,
  Intermedio: 2,
  Avanzado: 3,
  Experto: 4,
};

export default function Technologies({ technologies }: Props) {
  if (technologies.length === 0) return null;

  return (
    <div>
      <div className="border-border divide-border divide-y border-y">
        {technologies.map((group) => (
          <div key={group.title} className="grid gap-3 py-4 md:grid-cols-[180px_1fr] md:gap-8">
            <Mono className="text-foreground">{group.title}</Mono>

            <ul className="grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {group.skills.map((skill) => (
                <li
                  key={skill.name}
                  className="border-border/50 flex w-full max-w-72 items-center justify-between gap-3 border-b pb-1.5"
                >
                  <span className="text-foreground truncate font-mono text-xs">{skill.name}</span>
                  <Meter value={LEVEL_VALUE[skill.level] ?? 1} label={`${skill.name}: ${skill.level}`} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-3">
        <Mono className="text-muted-foreground/70">Nivel: 1 barra principiante · 4 barras experto</Mono>
      </p>
    </div>
  );
}
