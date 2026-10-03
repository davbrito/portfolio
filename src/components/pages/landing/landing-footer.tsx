import { icons } from "@/components/icons";
import { CvDownloadButton } from "@/components/pages/landing/cv-download";
import { Mono, TechLink } from "@/components/pages/landing/primitives";
import { VitalsPanel } from "@/components/pages/landing/vitals-panel";
import type { SocialLink } from "@/data/portfolio";

const YEAR = new Date().getFullYear();

interface Props {
  socialLinks: SocialLink[];
  name: string;
}

export default function LandingFooter({ socialLinks, name }: Props) {
  return (
    <footer role="contentinfo" className="border-border border-t">
      {/* Cierre: una última llamada a la acción antes de irse */}
      <div className="border-border border-b">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-foreground text-4xl leading-[1.02] font-bold tracking-[-0.035em] text-balance sm:text-5xl md:text-6xl">
              ¿Construimos algo <span className="accent-serif text-primary">juntos</span>?
            </h2>
            <p className="text-muted-foreground mt-5 max-w-lg text-base leading-relaxed">
              Abierto a puestos fullstack y frontend, en remoto o híbrido. Descarga el CV o escríbeme por el canal que
              prefieras.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CvDownloadButton
                label="Descargar CV"
                variant="default"
                className="pressable bg-primary text-primary-foreground hover:bg-primary/85 h-11 rounded-none px-5 text-sm font-semibold"
              />
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="pressable border-border text-foreground hover:border-primary hover:text-primary inline-flex h-11 items-center gap-2 border px-4 text-sm font-medium"
                  {...(link.obfuscated ? { "data-ob": link.obfuscationTarget } : {})}
                >
                  {icons[link.icon]("h-4 w-4")}
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Prueba de oficio: métricas reales de esta misma carga */}
          <div className="lg:col-span-5">
            <VitalsPanel />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <Mono className="text-muted-foreground">
            © {YEAR} {name}
          </Mono>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Mono className="text-muted-foreground/70">
              Hecho a mano con TanStack Start · React 19 · Tailwind 4 · Prisma
            </Mono>
            <TechLink href="#inicio">Volver arriba ↑</TechLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
