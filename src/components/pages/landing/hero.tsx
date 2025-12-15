import { icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { SocialLink } from "@/data/portfolio";
import type { ProfileModel } from "@prisma-generated/models";
import { ArrowRightIcon } from "lucide-react";

interface HeroProps {
  socialLinks: SocialLink[];
  profile: ProfileModel;
}

export function Hero({ socialLinks, profile }: HeroProps) {
  return (
    <div className="min-h-[65vh] content-center space-y-6">
      <p className="text-primary font-mono text-sm font-semibold">
        Hola, mi nombre es
      </p>
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
          {profile.name}.
        </h1>
        <h2 className="text-muted-foreground text-3xl font-extrabold sm:text-4xl">
          {profile.description}.
        </h2>
      </div>
      <p className="text-muted-foreground max-w-2xl">{profile.brief}</p>

      <div className="space-x-4">
        <Button
          nativeButton={false}
          render={<a href="#proyectos" />}
          className="min-w-40"
        >
          Ver Proyectos
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
        <Button
          nativeButton={false}
          render={<a href="#contacto" />}
          variant="outline"
          className="min-w-40"
        >
          Contacto
        </Button>
      </div>

      <div className="text-muted-foreground flex items-center gap-4">
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
                  "data-ob-key": link.obfuscationKey,
                }
              : {})}
          >
            {icons[link.icon]("h-5 w-5")}
          </a>
        ))}
      </div>
    </div>
  );
}
