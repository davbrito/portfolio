import { Mono, pad } from "@/components/pages/landing/primitives";

interface SectionHeaderProps {
  number: number;
  title: string;
  /** Identificador técnico mostrado a la derecha de la regla. */
  meta?: string;
  description?: string;
}

export function SectionHeader({ number, title, meta, description }: SectionHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3">
        <Mono className="text-primary shrink-0">§ {pad(number)}</Mono>
        <span className="bg-border h-px flex-1" aria-hidden />
        {meta ? <Mono className="text-muted-foreground shrink-0">{meta}</Mono> : null}
      </div>

      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-8">
        <h2 className="text-foreground text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{title}</h2>
        {description ? (
          <p className="text-muted-foreground max-w-md text-xs leading-relaxed md:text-right">{description}</p>
        ) : null}
      </div>
    </header>
  );
}
