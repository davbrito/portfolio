import { Mono } from "@/components/pages/landing/primitives";

/**
 * Cinta de telemetría: métricas derivadas del propio contenido del portafolio,
 * no valores decorativos.
 */
export function DataTicker({ items }: { items: { label: string; value: string }[] }) {
  // La cinta se duplica para que el desplazamiento sea continuo.
  const track = [
    ...items.map((item) => ({ ...item, key: `a:${item.label}` })),
    ...items.map((item) => ({ ...item, key: `b:${item.label}` })),
  ];

  return (
    <div className="border-border bg-card/40 ticker-mask overflow-hidden border-b" aria-hidden>
      <div className="ticker-track">
        {track.map((item) => (
          <span key={item.key} className="flex shrink-0 items-center gap-2 px-4 py-1.5">
            <span className="bg-primary/70 h-1 w-1" />
            <Mono className="text-muted-foreground">{item.label}</Mono>
            <Mono className="text-foreground">{item.value}</Mono>
            <span className="bg-border ml-2 h-3 w-px" />
          </span>
        ))}
      </div>
    </div>
  );
}
