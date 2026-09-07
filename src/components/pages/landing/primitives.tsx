import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

/** Etiqueta monoespaciada para metadatos, unidades y encabezados de dato. */
export function Mono({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn("font-mono text-[10px] tracking-[0.18em] uppercase", className)} {...props} />;
}

/**
 * Indicador de estado con pulso. `idle` lo deja en gris y sin animación para
 * señalar que el sistema está detenido. `label` se anuncia a lectores de pantalla.
 */
export function StatusDot({ label, idle = false, className }: { label: string; idle?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <span className={cn("status-dot", idle && "status-dot-idle")} aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** Superficie técnica: 1px de borde, esquinas marcadas, sin radio. */
export function Panel({ className, ticks = true, children, ...props }: ComponentProps<"div"> & { ticks?: boolean }) {
  return (
    <div
      className={cn(
        "border-border bg-card/60 relative min-w-0 border",
        ticks && "corner-ticks corner-ticks-inset",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Cabecera de panel: identificador a la izquierda, telemetría a la derecha. */
export function PanelHeader({
  id,
  title,
  meta,
  className,
}: {
  id?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-border flex items-center justify-between gap-3 border-b px-4 py-2", className)}>
      <div className="flex min-w-0 items-center gap-2">
        {id ? <Mono className="text-primary shrink-0">{id}</Mono> : null}
        <Mono className="text-muted-foreground truncate">{title}</Mono>
      </div>
      {meta ? <Mono className="text-muted-foreground shrink-0">{meta}</Mono> : null}
    </div>
  );
}

/** Medidor segmentado: densidad de dato sin gradientes. */
export function Meter({ value, total = 4, label }: { value: number; total?: number; label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-[3px]"
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={label}
    >
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={cn("h-2.5 w-[3px]", index < value ? "bg-primary" : "bg-border")} aria-hidden />
      ))}
    </span>
  );
}

/** Enlace de salida con subrayado que se despliega al enfocar. */
export function TechLink({ className, children, ...props }: ComponentProps<"a"> & { children: ReactNode }) {
  return (
    <a
      className={cn(
        "link-tech pressable text-foreground hover:text-primary focus-visible:text-primary inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

/** Fila clave/valor: la unidad estructural de las fichas técnicas. */
export function SpecRow({ label, value, className }: { label: string; value: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "border-border/70 flex items-baseline justify-between gap-4 border-b py-2 last:border-b-0",
        className,
      )}
    >
      <Mono className="text-muted-foreground">{label}</Mono>
      <span className="text-foreground truncate text-right font-mono text-xs">{value}</span>
    </div>
  );
}
