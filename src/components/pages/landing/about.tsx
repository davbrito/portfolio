import type { ProfileModel } from "@prisma-generated/models";
import { CalendarIcon, CodeXmlIcon, MapPin } from "lucide-react";

interface Props {
  profile: ProfileModel;
}

export default function About({ profile }: Props) {
  const aboutParagraphs = profile.aboutText.split(/\n+/).filter(Boolean);
  return (
    <div className="flex flex-col gap-10 md:flex-row md:items-center">
      <div className="space-y-4">
        {aboutParagraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-muted-foreground leading-relaxed text-balance"
          >
            {paragraph}
          </p>
        ))}

        <div className="text-primary flex flex-wrap items-center gap-3 text-sm">
          <div className="text-muted-foreground inline-flex items-center gap-2 px-3 py-1">
            <MapPin className="text-primary h-4 w-4" />
            {profile.location}
          </div>
          <div className="text-muted-foreground inline-flex items-center gap-2 px-3 py-1">
            <CalendarIcon className="text-primary h-4 w-4" />
            {profile.experience}
          </div>
          <div className="text-muted-foreground inline-flex items-center gap-2 px-3 py-1">
            <CodeXmlIcon className="text-primary h-4 w-4" />
            {profile.title}
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="border-border bg-card/60 shadow-primary/5 overflow-hidden rounded-3xl border shadow-lg md:max-h-100">
          <img
            src={profile.aboutImage ?? "https://placehold.co/400x600/png"}
            alt={profile.aboutImageAlt}
            className="h-full w-full object-cover"
            loading="lazy"
            width={400}
            height={600}
          />
        </div>
      </div>
    </div>
  );
}
