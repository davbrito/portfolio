/**
 * Cinta del stack: los nombres de tecnología que un reclutador busca con la
 * vista, en movimiento continuo. Decorativa — el stack completo está en su
 * sección, así que se oculta a lectores de pantalla.
 */
export function DataTicker({ items }: { items: string[] }) {
  // La cinta se duplica para que el desplazamiento sea continuo.
  const track = [...items.map((item) => `a:${item}`), ...items.map((item) => `b:${item}`)];

  return (
    <div className="border-border ticker-mask overflow-hidden border-y" aria-hidden>
      <div className="ticker-track py-4">
        {track.map((key) => (
          <span key={key} className="flex shrink-0 items-center gap-6 px-3">
            <span className="font-display text-muted-foreground/80 text-xl font-medium tracking-[-0.01em] whitespace-nowrap sm:text-2xl">
              {key.slice(2)}
            </span>
            <span className="text-primary text-sm">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
