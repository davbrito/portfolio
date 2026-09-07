import { Mono, Panel, PanelHeader } from "@/components/pages/landing/primitives";
import { pad } from "@/components/pages/landing/tech-layers";
import type { ExperienceItem } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

export function Experience({ experience }: { experience: ExperienceItem[] }) {
  const [selected, setSelected] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const item = experience[selected];

  function focusTab(index: number) {
    const next = (index + experience.length) % experience.length;
    setSelected(next);
    tabsRef.current[next]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(experience.length - 1);
        break;
    }
  }

  if (experience.length === 0) return null;

  return (
    <div className="grid gap-6 md:grid-cols-12 md:gap-8">
      <div
        className="border-border divide-border divide-y self-start border md:col-span-4"
        role="tablist"
        aria-orientation="vertical"
        aria-label="Empresas"
      >
        {experience.map((exp, index) => {
          const active = selected === index;
          return (
            <button
              key={exp.id}
              ref={(node) => {
                tabsRef.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`experience-tab-${index}`}
              aria-selected={active}
              aria-controls={`experience-tabpanel-${index}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "pressable focus-visible:ring-ring flex w-full flex-col items-start gap-1 border-l-2 px-3 py-3 text-left focus-visible:ring-1 focus-visible:outline-none",
                active
                  ? "border-l-primary bg-primary/8 text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border-l-transparent",
              )}
            >
              <Mono className={active ? "text-primary" : "text-muted-foreground/70"}>{pad(index + 1)}</Mono>
              <span className="w-full truncate font-mono text-xs">{exp.company}</span>
              <Mono className="text-muted-foreground/70 truncate">{exp.period}</Mono>
            </button>
          );
        })}
      </div>

      {item ? (
        <div
          className="md:col-span-8"
          role="tabpanel"
          id={`experience-tabpanel-${selected}`}
          aria-labelledby={`experience-tab-${selected}`}
          tabIndex={0}
        >
          <Panel>
            <PanelHeader id={pad(selected + 1)} title={item.company} meta={item.period} />

            <div className="border-border border-b px-4 py-4">
              <h3 className="text-foreground text-lg font-semibold tracking-[-0.01em]">{item.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                <Mono className="text-primary">@ {item.company}</Mono>
                {item.location ? <Mono className="text-muted-foreground">{item.location}</Mono> : null}
              </div>
            </div>

            <ol className="divide-border/60 divide-y">
              {(item.highlights ?? []).map((highlight, index) => (
                <li key={highlight} className="flex gap-4 px-4 py-3">
                  <Mono className="text-primary/70 shrink-0 pt-1">{pad(index + 1)}</Mono>
                  <span className="text-muted-foreground text-sm leading-relaxed text-pretty">{highlight}</span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      ) : null}
    </div>
  );
}
