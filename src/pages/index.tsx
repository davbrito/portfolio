import { getMeta } from "@/components/head";
import About from "@/components/pages/landing/about";
import ContactForm from "@/components/pages/landing/contact-form";
import { DataTicker } from "@/components/pages/landing/data-ticker";
import { Experience } from "@/components/pages/landing/experience";
import { Hero } from "@/components/pages/landing/hero";
import LandingFooter from "@/components/pages/landing/landing-footer";
import Projects from "@/components/pages/landing/projects";
import { SectionHeader } from "@/components/pages/landing/section-header";
import { TelemetryBar } from "@/components/pages/landing/telemetry-bar";
import Technologies from "@/components/pages/landing/technologies";
import { getPortfolioData } from "@/data/portfolio";
import { setupObfuscatedLinks } from "@/lib/obfuscation";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Hydrate } from "@tanstack/react-start";
import { visible } from "@tanstack/react-start/hydration";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  ssr: true,

  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.data.profile.name} - ${loaderData.data.profile.title}` : "Portfolio";

    return {
      meta: getMeta({
        title,
      }),
    };
  },
  loader: async () => {
    const data = await getPortfolioData();
    if (!data || !data.profile.active) {
      console.error({ message: "Profile is not active or not found." });
      throw notFound();
    }
    return { data };
  },
  component: Index,
});

const NAV_ITEMS = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#stack", label: "Stack" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#contacto", label: "Contacto" },
];

function Index() {
  const { data } = Route.useLoaderData();

  useEffect(() => {
    requestIdleCallback(() => {
      setupObfuscatedLinks(data.obKey);
    });
  }, [data.obKey]);

  const { socialLinks, experience, technologies, profile, projects } = data;

  const ticker = [
    { label: "Estado", value: "Disponible para proyectos" },
    { label: "Rol", value: profile.title },
    { label: "Ubicación", value: profile.location },
    { label: "Experiencia", value: profile.experience },
  ];

  return (
    <div className="landing-shell text-foreground relative isolate min-h-screen font-sans">
      {/* Retícula técnica de fondo */}
      <div className="blueprint-grid pointer-events-none fixed inset-0 -z-10" aria-hidden />

      <TelemetryBar navItems={NAV_ITEMS} profile={profile} />
      <DataTicker items={ticker} />

      <main role="main" className="border-border/60 mx-auto max-w-6xl px-4 sm:border-x sm:px-6">
        <section id="inicio" className="py-12 md:py-16">
          <Hero socialLinks={socialLinks} profile={profile} />
        </section>

        <section id="sobre-mi" className="tech-reveal border-border scroll-mt-28 border-t py-12 md:py-16">
          <SectionHeader
            number={1}
            title="Sobre mí"
            meta="sobre-mi"
            description="Quién soy, dónde estoy y cómo trabajo."
          />
          <About profile={profile} />
        </section>

        <section id="experiencia" className="tech-reveal border-border scroll-mt-28 border-t py-12 md:py-16">
          <SectionHeader
            number={2}
            title="Experiencia"
            meta="experiencia"
            description="Dónde he trabajado y qué construí en cada lugar."
          />
          <Experience experience={experience} />
        </section>

        <section id="stack" className="tech-reveal border-border scroll-mt-28 border-t py-12 md:py-16">
          <SectionHeader
            number={3}
            title="Stack técnico"
            meta="stack"
            description="Las tecnologías que uso, agrupadas por capa del sistema."
          />
          <Technologies technologies={technologies} />
        </section>

        <section id="proyectos" className="tech-reveal border-border scroll-mt-28 border-t py-12 md:py-16">
          <SectionHeader
            number={4}
            title="Proyectos"
            meta="proyectos"
            description="Qué resuelve cada proyecto, con qué está construido y dónde verlo funcionando."
          />
          <Projects projects={projects} />
        </section>

        <section id="contacto" className="tech-reveal border-border scroll-mt-28 border-t py-12 md:py-16">
          <SectionHeader
            number={5}
            title="Contacto"
            meta="contacto"
            description="Escríbeme y respondo con una lectura honesta de la viabilidad."
          />
          <Hydrate when={visible({ rootMargin: "400px" })}>
            <ContactForm profileId={profile.userId} />
          </Hydrate>
        </section>
      </main>

      <LandingFooter name={profile.name} socialLinks={socialLinks} />
    </div>
  );
}
