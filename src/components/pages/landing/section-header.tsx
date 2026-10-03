import { Mono, pad } from "@/components/pages/landing/primitives";

interface SectionHeaderProps {
  number: number;
  /** Etiqueta corta sobre el titular (p. ej. "Experiencia"). */
  eyebrow: string;
  title: string;
  /** Palabra final del titular que se escribe en serif cursiva. */
  accent?: string;
  description?: string;
}

export function SectionHeader({ number, eyebrow, title, accent, description }: SectionHeaderProps) {
  return (
    <header className="mb-10 md:mb-12">
      <div className="flex items-center gap-3">
        <Mono className="text-primary shrink-0">{pad(number)}</Mono>
        <span className="bg-primary/50 h-px w-8" aria-hidden />
        <Mono className="text-muted-foreground shrink-0">{eyebrow}</Mono>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
        <h2 className="font-display text-foreground max-w-2xl text-3xl leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-4xl md:text-5xl">
          {title}
          {accent ? (
            <>
              {" "}
              <span className="accent-serif text-primary">{accent}</span>
            </>
          ) : null}
        </h2>
        {description ? (
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed md:text-right">{description}</p>
        ) : null}
      </div>
    </header>
  );
}
