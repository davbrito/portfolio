import { Mono, pad } from "@/components/pages/landing/primitives";
import type { Profile } from "@/data/portfolio";
import { GaugeIcon, LayersIcon, MessagesSquareIcon } from "lucide-react";

interface Props {
  profile: Profile;
}

/** Cómo trabajo: tres principios concretos en lugar de adjetivos sueltos. */
const PRINCIPLES = [
  {
    icon: LayersIcon,
    title: "Arquitectura que escala",
    text: "Código modular y tipado de punta a punta, pensado para que el equipo lo mantenga.",
  },
  {
    icon: GaugeIcon,
    title: "Rendimiento medible",
    text: "Interfaces rápidas y accesibles; las decisiones se validan con métricas, no con intuición.",
  },
  {
    icon: MessagesSquareIcon,
    title: "Comunicación clara",
    text: "Acostumbrado a equipos remotos: documento, explico los trade-offs y entrego a tiempo.",
  },
];

export default function About({ profile }: Props) {
  const [lead, ...rest] = profile.aboutText
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  return (
    <div className="grid gap-12 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-7">
        {lead ? (
          <p className="font-display text-foreground text-2xl leading-snug font-medium tracking-[-0.02em] text-pretty sm:text-[1.7rem]">
            {lead}
          </p>
        ) : null}
        <div className="mt-6 space-y-4">
          {rest.map((paragraph, index) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key
            <p key={index} className="text-muted-foreground text-base leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <ul className="border-border divide-border divide-y border-y md:col-span-5">
        {PRINCIPLES.map((principle, index) => (
          <li key={principle.title} className="flex gap-4 py-5">
            <span className="border-border text-primary inline-flex h-10 w-10 shrink-0 items-center justify-center border">
              <principle.icon className="h-4.5 w-4.5" aria-hidden />
            </span>
            <div>
              <div className="flex items-baseline gap-2">
                <Mono className="text-muted-foreground/70">{pad(index + 1)}</Mono>
                <h3 className="text-foreground font-medium">{principle.title}</h3>
              </div>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{principle.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
