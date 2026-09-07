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
  { href: "#perfil", label: "Perfil" },
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
    { label: "Estado", value: "Disponible" },
    { label: "Rol", value: profile.title },
    { label: "Base", value: profile.location },
    { label: "Capas", value: "Cliente · Lógica · Datos · Infra" },
    { label: "Canal", value: "Abierto" },
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

        <section id="perfil" className="tech-reveal border-border scroll-mt-28 border-t py-12 md:py-16">
          <SectionHeader
            number={1}
            title="Perfil del operador"
            meta="perfil/operador"
            description="Contexto, base de operaciones y forma de trabajo."
          />
          <About profile={profile} />
        </section>

        <section id="experiencia" className="tech-reveal border-border scroll-mt-28 border-t py-12 md:py-16">
          <SectionHeader
            number={2}
            title="Registro de operaciones"
            meta="registro/trayectoria"
            description="Trayectoria por nodo: responsabilidades asumidas y resultados entregados."
          />
          <Experience experience={experience} />
        </section>

        <section id="stack" className="tech-reveal border-border scroll-mt-28 border-t py-12 md:py-16">
          <SectionHeader
            number={3}
            title="Matriz de infraestructura"
            meta="infra/capacidades"
            description="Capacidades técnicas organizadas por capa lógica, del cliente a la infraestructura."
          />
          <Technologies technologies={technologies} />
        </section>

        <section id="proyectos" className="tech-reveal border-border scroll-mt-28 border-t py-12 md:py-16">
          <SectionHeader
            number={4}
            title="Sistemas en catálogo"
            meta="sistemas/fichas-tecnicas"
            description="Cada proyecto documentado como especificación: flujo de datos, parámetros y accesos directos."
          />
          <Projects projects={projects} />
        </section>

        <section id="contacto" className="tech-reveal border-border scroll-mt-28 border-t py-12 md:py-16">
          <SectionHeader
            number={5}
            title="Terminal de enlace"
            meta="link/canal-directo"
            description="Canal directo y verificado. Sin intermediarios ni formularios genéricos."
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
