import { Emphasize, Mono } from "@/components/pages/landing/primitives";
import type { ExperienceItem } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/**
 * Línea de tiempo con todo a la vista: quien evalúa un perfil lee en diagonal
 * y no debería tener que hacer clic para ver qué se logró en cada puesto.
 */
export function Experience({ experience }: { experience: ExperienceItem[] }) {
  if (experience.length === 0) return null;

  return (
    <ol className="relative">
      {experience.map((item, index) => {
        const current = index === 0;
        return (
          <li key={item.id} className="group grid gap-3 md:grid-cols-12 md:gap-8">
            {/* Columna de fecha */}
            <div className="md:col-span-3 md:pt-1 md:text-right">
              <Mono className={cn(current ? "text-primary" : "text-muted-foreground")}>{item.period}</Mono>
              {item.location ? (
                <span className="text-muted-foreground/80 mt-1 block text-xs md:mt-1.5">{item.location}</span>
              ) : null}
            </div>

            <div className="border-border relative border-l pb-12 pl-6 group-last:pb-0 md:col-span-9 md:pl-8">
              <span
                className={cn(
                  "absolute top-1.5 -left-[6px] h-[11px] w-[11px] border",
                  current ? "border-primary bg-primary" : "border-border bg-background group-hover:border-primary",
                )}
                aria-hidden
              />
              <h3 className="font-display text-foreground text-xl font-semibold tracking-[-0.02em]">{item.title}</h3>
              <p className="text-primary mt-0.5 text-sm font-medium">{item.company}</p>

              {(item.highlights ?? []).length > 0 ? (
                <ul className="mt-4 space-y-2.5">
                  {(item.highlights ?? []).map((highlight) => (
                    <li key={highlight} className="text-muted-foreground flex gap-3 text-[15px] leading-relaxed">
                      <span className="bg-primary/70 mt-[0.6em] h-1 w-1 shrink-0" aria-hidden />
                      <span className="text-pretty">
                        <Emphasize text={highlight} />
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
