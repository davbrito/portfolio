import { CvDownloadButton } from "@/components/pages/landing/cv-download";
import { Mono, StatusDot, pad } from "@/components/pages/landing/primitives";
import type { Profile } from "@/data/portfolio";
import { useEffect, useState } from "react";

interface NavItem {
  href: string;
  label: string;
}

/**
 * Reloj UTC de la barra de telemetría. Se monta con guiones para que el HTML
 * del servidor y el del cliente coincidan y sólo entonces empieza a correr.
 */
function UtcClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(new Date().toISOString().slice(11, 19));
    const frame = requestAnimationFrame(tick);
    const id = setInterval(tick, 1000);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(id);
    };
  }, []);

  return (
    <Mono className="text-muted-foreground tabular-nums">
      UTC <span className="text-foreground">{time ?? "--:--:--"}</span>
    </Mono>
  );
}

export function TelemetryBar({ navItems, profile }: { navItems: NavItem[]; profile: Profile }) {
  return (
    <div className="bg-background/90 border-border sticky top-0 z-30 border-b backdrop-blur">
      {/* Fila 1 — identidad técnica y disponibilidad operativa */}
      <div className="border-border/60 border-b">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="border-primary text-primary inline-flex h-5 items-center border px-1.5 font-mono text-[10px] font-bold tracking-[0.12em]">
              DB
            </span>
            <Mono className="text-foreground truncate">{profile.name}</Mono>
            <Mono className="text-muted-foreground hidden truncate sm:inline">{`// ${profile.title}`}</Mono>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <Mono className="text-muted-foreground hidden lg:inline">LOC {profile.location}</Mono>
            <div className="hidden lg:block">
              <UtcClock />
            </div>
            <span className="inline-flex items-center gap-2">
              <StatusDot label="Estado del sistema: operativo" />
              <Mono className="text-primary ml-2.5">Disponible</Mono>
            </span>
          </div>
        </div>
      </div>

      {/* Fila 2 — comandos de navegación y acceso directo */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <nav
          aria-label="Secciones"
          className="-mx-1 flex scrollbar-none items-center gap-1 overflow-x-auto py-1.5 md:gap-0"
        >
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className="pressable text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring group inline-flex shrink-0 items-center gap-1.5 px-2 py-1.5 font-mono text-[11px] tracking-[0.1em] uppercase focus-visible:ring-1 focus-visible:outline-none"
            >
              <span className="text-primary/70 group-hover:text-primary">{pad(index + 1)}</span>
              <span className="whitespace-nowrap">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 py-1.5">
          <CvDownloadButton
            label="cv.pdf"
            variant="outline"
            className="pressable border-border hover:border-primary hover:text-primary h-7 px-2.5 font-mono text-[11px] tracking-[0.1em] uppercase"
          />
        </div>
      </div>

      {/* Progreso de lectura: 1px, acento eléctrico */}
      <div className="scroll-progress-bar bg-primary absolute inset-x-0 bottom-0 h-px origin-left" aria-hidden />
    </div>
  );
}
