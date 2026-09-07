import { icons } from "@/components/icons";
import { VitalsPanel } from "@/components/pages/landing/vitals-panel";
import { Mono } from "@/components/pages/landing/primitives";
import type { Profile, SocialLink } from "@/data/portfolio";
import { ArrowRightIcon } from "lucide-react";

interface HeroProps {
  socialLinks: SocialLink[];
  profile: Profile;
}

const THESIS = ["Arquitecturas escalables", "Interfaces reactivas", "Sistemas observables"];

export function Hero({ socialLinks, profile }: HeroProps) {
  const specs = [
    { label: "Rol", value: profile.title },
    { label: "Experiencia", value: profile.experience },
    { label: "Ubicación", value: profile.location },
    { label: "Disponibilidad", value: "Abierto a propuestas" },
  ];

  return (
    <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div className="animate-fade-in-up flex items-center gap-3" style={{ animationDelay: "60ms" }}>
          <Mono className="text-primary">Hola, soy</Mono>
          <span className="bg-border h-px flex-1" aria-hidden />
          <Mono className="text-muted-foreground">{profile.title}</Mono>
        </div>

        <h1
          className="animate-fade-in-up text-foreground mt-6 text-5xl leading-[0.92] font-semibold tracking-[-0.035em] text-balance sm:text-6xl md:text-7xl"
          style={{ animationDelay: "120ms" }}
        >
          {profile.name}
        </h1>

        <p
          className="animate-fade-in-up text-muted-foreground mt-4 max-w-xl text-2xl leading-tight font-medium tracking-[-0.02em] text-balance sm:text-3xl"
          style={{ animationDelay: "180ms" }}
        >
          {profile.description}
        </p>

        {/* Tesis de ingeniería */}
        <ul
          className="animate-fade-in-up mt-6 flex flex-wrap items-center gap-x-4 gap-y-2"
          style={{ animationDelay: "240ms" }}
        >
          {THESIS.map((item) => (
            <li key={item} className="text-muted-foreground inline-flex items-center gap-2">
              <span className="bg-primary h-1 w-1" aria-hidden />
              <Mono>{item}</Mono>
            </li>
          ))}
        </ul>

        <p
          className="animate-fade-in-up border-primary/50 text-muted-foreground mt-6 max-w-xl border-l-2 pl-4 text-sm leading-relaxed text-pretty"
          style={{ animationDelay: "300ms" }}
        >
          {profile.brief}
        </p>

        <div className="animate-fade-in-up mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "360ms" }}>
          <a
            href="#proyectos"
            className="pressable bg-primary text-primary-foreground hover:bg-primary/85 focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-10 min-w-44 items-center justify-center gap-2 px-4 font-mono text-[11px] tracking-[0.14em] uppercase focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Ver sistemas
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href="#contacto"
            className="pressable border-border text-foreground hover:border-primary hover:text-primary focus-visible:ring-ring inline-flex h-10 min-w-44 items-center justify-center gap-2 border px-4 font-mono text-[11px] tracking-[0.14em] uppercase focus-visible:ring-1 focus-visible:outline-none"
          >
            Abrir canal
          </a>

          <div className="ml-1 flex items-center gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="pressable border-border text-foreground hover:border-primary hover:bg-muted focus-visible:ring-ring inline-flex h-10 w-10 items-center justify-center border focus-visible:ring-1 focus-visible:outline-none"
                {...(link.obfuscated ? { "data-ob": link.obfuscationTarget } : {})}
                aria-label={link.label}
              >
                {icons[link.icon]("h-4 w-4")}
              </a>
            ))}
          </div>
        </div>

        {/* Ficha de identidad */}
        <dl
          className="animate-fade-in-up border-border divide-border mt-10 grid grid-cols-2 divide-x divide-y border md:grid-cols-4 md:divide-y-0"
          style={{ animationDelay: "420ms" }}
        >
          {specs.map((spec) => (
            <div key={spec.label} className="min-w-0 px-3 py-3">
              <dt>
                <Mono className="text-muted-foreground">{spec.label}</Mono>
              </dt>
              <dd className="text-foreground mt-1.5 font-mono text-xs break-words">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="animate-fade-in-up lg:col-span-5" style={{ animationDelay: "260ms" }}>
        <VitalsPanel />
      </div>
    </div>
  );
}
