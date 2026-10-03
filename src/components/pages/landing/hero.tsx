import { icons } from "@/components/icons";
import { CvDownloadButton } from "@/components/pages/landing/cv-download";
import { Mono, StatusDot } from "@/components/pages/landing/primitives";
import type { Profile, SocialLink } from "@/data/portfolio";
import { ArrowRightIcon, MapPinIcon } from "lucide-react";

interface HeroStat {
  value: string;
  label: string;
}

interface HeroProps {
  socialLinks: SocialLink[];
  profile: Profile;
  /** Cifras derivadas del propio contenido: nada inventado. */
  stats: HeroStat[];
}

/** Separa la última palabra del rol para escribirla en serif cursiva. */
function splitTitle(title: string) {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return { lead: "", accent: title };
  return { lead: words.slice(0, -1).join(" "), accent: words.at(-1)! };
}

export function Hero({ socialLinks, profile, stats }: HeroProps) {
  const { lead, accent } = splitTitle(profile.title);

  return (
    <div className="relative">
      <div className="hero-glow pointer-events-none absolute -inset-x-40 -top-24 -bottom-10 -z-10" aria-hidden />

      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <div
            className="animate-fade-in-up border-primary/40 bg-primary/8 inline-flex items-center gap-2.5 border px-3 py-1.5"
            style={{ animationDelay: "40ms" }}
          >
            <StatusDot label="Disponible" />
            <span className="text-foreground ml-1 text-xs font-medium">Disponible para nuevas oportunidades</span>
          </div>

          <p className="animate-fade-in-up text-muted-foreground mt-8 text-lg" style={{ animationDelay: "100ms" }}>
            Hola, soy <span className="text-foreground font-medium">{profile.name}</span>
          </p>

          <h1
            className="animate-fade-in-up font-display text-foreground mt-2 text-5xl leading-[0.95] font-bold tracking-[-0.04em] text-balance sm:text-6xl md:text-7xl"
            style={{ animationDelay: "140ms" }}
          >
            {lead ? <>{lead} </> : null}
            <span className="accent-serif text-primary">{accent}</span>
          </h1>

          <p
            className="animate-fade-in-up text-foreground/90 mt-6 max-w-xl text-xl leading-snug text-balance sm:text-2xl"
            style={{ animationDelay: "200ms" }}
          >
            {profile.description}
          </p>

          <p
            className="animate-fade-in-up text-muted-foreground mt-4 max-w-xl text-base leading-relaxed text-pretty"
            style={{ animationDelay: "260ms" }}
          >
            {profile.brief}
          </p>

          <div
            className="animate-fade-in-up mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "320ms" }}
          >
            <CvDownloadButton
              label="Descargar CV"
              variant="default"
              className="pressable bg-primary text-primary-foreground hover:bg-primary/85 h-11 rounded-none px-5 text-sm font-semibold"
            />
            <a
              href="#contacto"
              className="pressable border-border text-foreground hover:border-primary hover:text-primary focus-visible:ring-ring inline-flex h-11 items-center justify-center gap-2 border px-5 text-sm font-medium focus-visible:ring-1 focus-visible:outline-none"
            >
              Hablemos
              <ArrowRightIcon className="h-4 w-4" />
            </a>

            <div className="flex items-center gap-2 sm:ml-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="pressable text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring inline-flex h-11 w-11 items-center justify-center focus-visible:ring-1 focus-visible:outline-none"
                  {...(link.obfuscated ? { "data-ob": link.obfuscationTarget } : {})}
                  aria-label={link.label}
                >
                  {icons[link.icon]("h-5 w-5")}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up lg:col-span-5" style={{ animationDelay: "220ms" }}>
          <figure className="portrait-frame mx-auto w-[calc(100%-14px)] max-w-sm lg:mr-[14px]">
            <img
              src={profile.aboutImage ?? "https://placehold.co/400x500/png"}
              alt={profile.aboutImageAlt}
              className="border-border aspect-[4/5] w-full border object-cover"
              width={400}
              height={500}
              fetchPriority="high"
            />
            <figcaption className="bg-background/85 border-border absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3 border px-3 py-2 backdrop-blur">
              <span className="text-foreground inline-flex min-w-0 items-center gap-1.5 text-xs">
                <MapPinIcon className="text-primary h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{profile.location}</span>
              </span>
              <Mono className="text-muted-foreground shrink-0">Remoto · Híbrido</Mono>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Cifras de un vistazo */}
      <dl
        className="animate-fade-in-up border-border divide-border mt-14 grid grid-cols-2 divide-x border-y md:grid-cols-4 [&>div:nth-child(n+3)]:border-t md:[&>div:nth-child(n+3)]:border-t-0"
        style={{ animationDelay: "380ms" }}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0 px-4 py-5 md:px-6">
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="font-display text-foreground block text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                {stat.value}
              </span>
              <span className="text-muted-foreground mt-1 block text-sm">{stat.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
