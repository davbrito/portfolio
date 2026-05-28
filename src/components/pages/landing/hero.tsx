import { icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { SocialLink } from "@/data/portfolio";
import type { ProfileModel } from "#prisma-generated/models.ts";
import { ArrowRightIcon } from "lucide-react";

interface HeroProps {
  socialLinks: SocialLink[];
  profile: ProfileModel;
}

export function Hero({ socialLinks, profile }: HeroProps) {
  return (
    <div className="min-h-[65vh] content-center space-y-6">
      <p
        className="text-primary animate-fade-in-up font-mono text-sm font-semibold"
        style={{ animationDelay: "100ms" }}
      >
        Hola, mi nombre es
      </p>
      <div className="space-y-3">
        <h1
          className="animate-fade-in-up from-foreground to-primary/70 bg-linear-to-br bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl md:text-6xl"
          style={{ animationDelay: "200ms" }}
        >
          {profile.name}.
        </h1>
        <h2
          className="animate-fade-in-up text-muted-foreground text-3xl font-extrabold sm:text-4xl"
          style={{ animationDelay: "300ms" }}
        >
          {profile.description}.
        </h2>
      </div>
      <p className="text-muted-foreground animate-fade-in-up max-w-2xl" style={{ animationDelay: "500ms" }}>
        {profile.brief}
      </p>

      <div className="animate-fade-in-up space-x-4" style={{ animationDelay: "700ms" }}>
        <Button nativeButton={false} render={<a href="#proyectos" />} className="min-w-40">
          Ver Proyectos
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
        <Button nativeButton={false} render={<a href="#contacto" />} variant="outline" className="min-w-40">
          Contacto
        </Button>
      </div>

      <div
        className="text-muted-foreground animate-fade-in-up flex items-center gap-4"
        style={{ animationDelay: "800ms" }}
      >
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="hover:bg-primary/10 hover:text-primary flex h-10 w-10 items-center justify-center rounded-lg transition"
            {...(link.obfuscated
              ? {
                  "data-ob": link.obfuscationTarget,
                }
              : {})}
            aria-label={link.label}
          >
            {icons[link.icon]("h-5 w-5")}
          </a>
        ))}
      </div>
    </div>
  );
}
