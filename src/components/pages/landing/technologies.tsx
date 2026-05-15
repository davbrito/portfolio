import type { TechnologyGroup } from "@/data/portfolio";

interface Props {
  technologies: TechnologyGroup[];
}

export default function Technologies({ technologies }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {technologies.map((group) => (
        <div key={group.title}>
          <div className="text-foreground mb-4 flex items-center gap-3 text-sm font-semibold tracking-wide uppercase">
            <span className="text-primary">▹</span>
            <span>{group.title}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {group.skills.map((skill) => (
              <div key={skill.name} className="border-border bg-card/70 text-foreground border px-3 py-3">
                <div className="text-primary flex items-center justify-between text-xs">
                  <span>{skill.name}</span>
                  <span className="bg-primary/10 text-primary rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide">
                    {skill.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}