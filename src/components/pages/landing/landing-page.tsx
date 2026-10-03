import About from "@/components/pages/landing/about";
import ContactForm from "@/components/pages/landing/contact-form";
import { DataTicker } from "@/components/pages/landing/data-ticker";
import { Experience } from "@/components/pages/landing/experience";
import { Hero } from "@/components/pages/landing/hero";
import LandingFooter from "@/components/pages/landing/landing-footer";
import Projects from "@/components/pages/landing/projects";
import { SectionHeader } from "@/components/pages/landing/section-header";
import { TelemetryBar } from "@/components/pages/landing/telemetry-bar";
import Technologies, { isCoreSkill } from "@/components/pages/landing/technologies";
import type { PortfolioData } from "@/data/portfolio";
import { Hydrate } from "@tanstack/react-start";
import { visible } from "@tanstack/react-start/hydration";

const NAV_ITEMS = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#stack", label: "Stack" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#contacto", label: "Contacto" },
];

const sectionClass = "tech-reveal border-border scroll-mt-24 border-t py-16 md:py-24";

export function LandingPage({ data }: { data: PortfolioData }) {
  const { socialLinks, experience, technologies, profile, projects } = data;

  const allSkills = technologies.flatMap((group) => group.skills);
  const coreSkills = allSkills.filter((skill) => isCoreSkill(skill.level)).map((skill) => skill.name);

  // Cifras del hero: todas salen del contenido real del perfil.
  const stats = [
    { value: profile.experience, label: "de experiencia" },
    { value: String(new Set(experience.map((item) => item.company)).size), label: "empresas" },
    { value: String(projects.length), label: "proyectos publicados" },
    { value: String(allSkills.length), label: "tecnologías" },
  ];

  return (
    <div className="landing-shell text-foreground relative isolate min-h-screen overflow-x-clip font-sans">
      {/* Retícula técnica de fondo */}
      <div className="blueprint-grid pointer-events-none fixed inset-0 -z-10" aria-hidden />

      <TelemetryBar navItems={NAV_ITEMS} profile={profile} />

      <main role="main">
        <section id="inicio" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-12 pb-16 sm:px-6 md:pt-20 md:pb-20">
          <Hero socialLinks={socialLinks} profile={profile} stats={stats} />
        </section>

        {allSkills.length > 0 ? (
          <DataTicker items={coreSkills.length >= 4 ? coreSkills : allSkills.map((skill) => skill.name)} />
        ) : null}

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <section id="sobre-mi" className={sectionClass}>
            <SectionHeader number={1} eyebrow="Sobre mí" title="Ingeniería con criterio de" accent="producto." />
            <About profile={profile} />
          </section>

          <section id="experiencia" className={sectionClass}>
            <SectionHeader
              number={2}
              eyebrow="Experiencia"
              title="Dónde he trabajado y qué"
              accent="logré."
              description="Cada puesto con sus resultados; las cifras clave van resaltadas."
            />
            <Experience experience={experience} />
          </section>

          <section id="stack" className={sectionClass}>
            <SectionHeader
              number={3}
              eyebrow="Stack técnico"
              title="Herramientas que domino a"
              accent="diario."
              description="Agrupadas por área; las resaltadas son las que uso a nivel avanzado."
            />
            <Technologies technologies={technologies} />
          </section>

          <section id="proyectos" className={sectionClass}>
            <SectionHeader
              number={4}
              eyebrow="Proyectos"
              title="Trabajo seleccionado,"
              accent="en producción."
              description="Qué resuelve cada proyecto, con qué está construido y dónde verlo funcionando."
            />
            <Projects projects={projects} />
          </section>

          <section id="contacto" className={sectionClass}>
            <SectionHeader number={5} eyebrow="Contacto" title="Escríbeme" accent="directamente." />
            <Hydrate when={visible({ rootMargin: "400px" })}>
              <ContactForm profileId={profile.userId} />
            </Hydrate>
          </section>
        </div>
      </main>

      <LandingFooter name={profile.name} socialLinks={socialLinks} />
    </div>
  );
}
