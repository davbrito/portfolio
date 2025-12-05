import { icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { Profile, SocialLink } from "@/data/portfolio";
import { ArrowRightIcon } from "lucide-react";

interface HeroProps {
  socialLinks: SocialLink[];
  profile: Profile;
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
          {profile.description}
        </h2>
      </div>
      <p className="text-muted-foreground max-w-2xl">{profile.brief}</p>

      <div className="space-x-4">
        <Button asChild className="min-w-40">
          <a href="#proyectos">
            Ver Proyectos
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </Button>
        <Button asChild variant="outline" className="min-w-40">
          <a href="#contacto">Contacto</a>
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
          >
            {icons[link.icon]("h-5 w-5")}
          </a>
        ))}
      </div>
    </div>
  );
}
