import { CvDownloadButton } from "@/components/pages/landing/cv-download";
import { Mono, StatusDot } from "@/components/pages/landing/primitives";
import type { Profile } from "@/data/portfolio";

interface NavItem {
  href: string;
  label: string;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

/**
 * Barra superior: identidad, navegación y la acción que más busca un
 * reclutador —el CV— siempre a la vista.
 */
export function TelemetryBar({ navItems, profile }: { navItems: NavItem[]; profile: Profile }) {
  return (
    <header className="bg-background/80 border-border sticky top-0 z-30 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#inicio" className="group flex min-w-0 items-center gap-3" aria-label={`${profile.name}, inicio`}>
          <span className="border-primary text-primary group-hover:bg-primary group-hover:text-primary-foreground font-display inline-flex h-8 w-8 shrink-0 items-center justify-center border text-sm font-bold transition-colors">
            {initials(profile.name)}
          </span>
          <span className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="font-display text-foreground truncate text-sm font-semibold">{profile.name}</span>
            <span className="text-muted-foreground truncate text-xs">{profile.title}</span>
          </span>
        </a>

        <nav aria-label="Secciones" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="pressable text-muted-foreground hover:text-foreground focus-visible:ring-ring px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden items-center gap-2 lg:inline-flex">
            <StatusDot label="Disponible para nuevas oportunidades" />
            <Mono className="text-primary ml-1.5">Disponible</Mono>
          </span>
          <CvDownloadButton
            label="Descargar CV"
            variant="default"
            className="pressable bg-primary text-primary-foreground hover:bg-primary/85 h-9 rounded-none px-3 text-sm font-medium"
          />
        </div>
      </div>

      {/* Navegación compacta para móvil */}
      <nav
        aria-label="Secciones (móvil)"
        className="border-border/60 flex scrollbar-none items-center gap-1 overflow-x-auto border-t px-2 md:hidden"
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-muted-foreground hover:text-foreground shrink-0 px-2.5 py-2 text-xs whitespace-nowrap"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Progreso de lectura: 1px, acento eléctrico */}
      <div className="scroll-progress-bar bg-primary absolute inset-x-0 bottom-0 h-px origin-left" aria-hidden />
    </header>
  );
}
