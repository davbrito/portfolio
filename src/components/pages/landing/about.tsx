import { Mono, Panel, PanelHeader, SpecRow } from "@/components/pages/landing/primitives";
import { pad } from "@/components/pages/landing/tech-layers";
import type { Profile } from "@/data/portfolio";

interface Props {
  profile: Profile;
}

export default function About({ profile }: Props) {
  const paragraphs = profile.aboutText.split(/\n{2,}/).filter((paragraph) => paragraph.trim().length > 0);

  return (
    <div className="grid gap-8 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-7">
        <div className="border-border divide-border divide-y border-y">
          {paragraphs.map((paragraph, index) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key
            <div key={index} className="flex gap-4 py-5">
              <Mono className="text-muted-foreground/70 shrink-0 pt-1">{pad(index + 1)}</Mono>
              <p className="text-muted-foreground text-sm leading-relaxed text-pretty">{paragraph}</p>
            </div>
          ))}
        </div>

        <dl className="mt-6">
          <SpecRow label="Rol" value={profile.title} />
          <SpecRow label="Ubicación" value={profile.location} />
          <SpecRow label="Experiencia" value={profile.experience} />
          <SpecRow label="Modalidad" value="Remoto · Híbrido" />
        </dl>
      </div>

      <div className="md:col-span-5">
        <Panel>
          <PanelHeader title="Foto" meta="400×600" />
          <div className="relative">
            <img
              src={profile.aboutImage ?? "https://placehold.co/400x600/png"}
              alt={profile.aboutImageAlt}
              className="h-full max-h-105 w-full object-cover grayscale transition-[filter] duration-300 ease-out hover:grayscale-0"
              loading="lazy"
              width={400}
              height={600}
            />
            <div
              className="pointer-events-none absolute inset-0 border border-white/5 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px]"
              aria-hidden
            />
          </div>
          <div className="border-border border-t px-3 py-2">
            <Mono className="text-muted-foreground line-clamp-1">{profile.aboutImageAlt}</Mono>
          </div>
        </Panel>
      </div>
    </div>
  );
}
