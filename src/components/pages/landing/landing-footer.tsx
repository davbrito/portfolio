import type { SocialLink } from "@/data/portfolio";

interface Props {
  socialLinks: SocialLink[];
  name: string;
}

export default function LandingFooter({ socialLinks, name }: Props) {
  return (
    <footer className="text-muted-foreground mt-16 flex flex-col items-center gap-2 pb-6 text-center text-xs">
      <div className="text-foreground flex items-center gap-4">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition"
            {...(link.obfuscated
              ? {
                  "data-ob": link.obfuscationTarget,
                  "data-ob-key": link.obfuscationKey,
                }
              : {})}
          >
            {link.label}
          </a>
        ))}
      </div>
      <p>
        Diseñado y desarrollado por <span className="text-primary">{name}</span>. Hecho con Astro, React y Tailwind
        CSS.
      </p>
      <p className="text-[11px]">
        © {new Date().getFullYear()}
        {name}. Todos los derechos reservados.
      </p>
    </footer>
  );
}