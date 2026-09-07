import { Mono, TechLink } from "@/components/pages/landing/primitives";
import type { SocialLink } from "@/data/portfolio";

const YEAR = new Date().getFullYear();

interface Props {
  socialLinks: SocialLink[];
  name: string;
}

export default function LandingFooter({ socialLinks, name }: Props) {
  return (
    <footer role="contentinfo" className="border-border border-t">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-border/60 flex flex-col gap-4 border-b py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {socialLinks.map((link) => (
              <TechLink
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                {...(link.obfuscated ? { "data-ob": link.obfuscationTarget } : {})}
              >
                [ {link.label} ]
              </TechLink>
            ))}
          </div>

          <Mono className="text-muted-foreground">Build · TanStack Start · React 19 · Tailwind 4 · Prisma</Mono>
        </div>

        <div className="py-5">
          <Mono className="text-muted-foreground">
            © {YEAR} {name} · Todos los derechos reservados
          </Mono>
        </div>
      </div>
    </footer>
  );
}
