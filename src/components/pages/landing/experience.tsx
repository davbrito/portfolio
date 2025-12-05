import type { ExperienceData } from "@/data/portfolio";
import { useState } from "react";

export function Experience({ experience }: { experience: ExperienceData[] }) {
  const [selected, setSelected] = useState(0);

  const item = experience[selected];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[170px_1fr] md:items-start">
      <div className="flex flex-col items-stretch md:w-40">
        {experience.map((exp, index) => (
          <div
            key={index}
            aria-selected={selected === index ? "true" : "false"}
            onClick={() => setSelected(index)}
            className="aria-selected:bg-primary/8 border-primary text-primary mb-4 inline-flex items-center gap-2 px-6 py-2 font-mono text-sm aria-selected:border-l-2"
          >
            {exp.role}
          </div>
        ))}
      </div>

      {/* Right panel: card with company, period and highlights */}
      {item ? (
        <div className="flex-1">
          <div className="text-foreground flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h3 className="text-foreground flex items-center gap-2 text-sm font-semibold">
                {item.role}
                <span className="text-primary underline-offset-4 hover:underline">
                  @ {item.company}
                </span>
              </h3>
            </div>

            <div className="text-muted-foreground text-xs">
              <span>{item.period}</span>
            </div>
          </div>

          <ul className="text-foreground/80 mt-6 space-y-4 text-sm leading-relaxed">
            {item.highlights.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-primary mt-1 text-lg leading-none">
                  ▹
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
