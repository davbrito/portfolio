import { getMeta } from "@/components/head";
import About from "@/components/pages/landing/about";
import ContactForm from "@/components/pages/landing/contact-form";
import { Experience } from "@/components/pages/landing/experience";
import { Hero } from "@/components/pages/landing/hero";
import LandingFooter from "@/components/pages/landing/landing-footer";
import { LandingHeader } from "@/components/pages/landing/landing-header";
import Projects from "@/components/pages/landing/projects";
import { SectionHeader } from "@/components/pages/landing/section-header";
import Technologies from "@/components/pages/landing/technologies";
import { getPortfolioData } from "@/data/portfolio";
import { setupObfuscatedLinks } from "@/lib/obfuscation";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Hydrate } from "@tanstack/react-start";
import { visible } from "@tanstack/react-start/hydration";
import { ArrowDown } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  ssr: true,
  head: ({ loaderData }) => ({
    meta: getMeta({
      title: `${loaderData!.data.profile.name} - ${loaderData!.data.profile.title}`,
    }),
  }),
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

function Index() {
  const { data } = Route.useLoaderData();

  useEffect(() => {
    requestIdleCallback(() => {
      setupObfuscatedLinks(data.obKey);
    });
  }, [data.obKey]);

  const { socialLinks, experience, technologies, profile, projects } = data;
  return (
    <>
      <div className="bg-background text-foreground relative isolate min-h-screen font-sans">
        {/* Reading progress bar */}
        <div className="scroll-progress-bar bg-primary fixed top-0 left-0 z-50 h-0.5 w-full" aria-hidden />
        {/* Background decorative elements */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none" aria-hidden>
          <div className="orb-parallax-1 bg-primary/8 absolute -top-72 -left-72 h-175 w-175 rounded-full blur-3xl" />
          <div className="orb-parallax-2 bg-primary/6 absolute -right-72 -bottom-72 h-150 w-150 rounded-full blur-3xl" />
          <div className="orb-parallax-3 bg-accent/4 absolute top-1/2 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
          <div className="hero-gradient absolute inset-0" />
          <div className="dot-grid absolute inset-0" />
        </div>
        <LandingHeader
          navItems={[
            { href: "#sobre-mi", label: "Sobre mi" },
            { href: "#experiencia", label: "Experiencia" },
            { href: "#tecnologias", label: "Tecnologías" },
            { href: "#proyectos", label: "Proyectos" },
            { href: "#contacto", label: "Contacto" },
          ]}
        />
        <div className="px-5 pb-16 sm:px-8 md:px-10">
          <main role="main" className="space-y-48 pt-10 md:pt-16">
            <section className="mx-auto max-w-4xl">
              <Hero socialLinks={socialLinks} profile={profile} />
            </section>

            <div className="flex justify-center" aria-hidden>
              <ArrowDown className="text-muted-foreground h-5 w-5 animate-bounce" />
            </div>

            <section id="sobre-mi" className="section-reveal mx-auto max-w-4xl">
              <SectionHeader number={1} title="Sobre mí" />

              <About profile={profile} />
            </section>

            <section id="experiencia" className="section-reveal mx-auto max-w-4xl">
              <SectionHeader number={2} title="Experiencia" />

              <Experience experience={experience} />
            </section>

            <section id="tecnologias" className="section-reveal mx-auto max-w-4xl">
              <SectionHeader number={3} title="Tecnologías" />

              <Technologies technologies={technologies} />
            </section>

            <section id="proyectos" className="section-reveal mx-auto max-w-4xl">
              <SectionHeader number={4} title="Proyectos" />

              <Projects projects={projects} />
            </section>

            <section id="contacto" className="section-reveal mx-auto max-w-prose space-y-8">
              <Hydrate when={visible({ rootMargin: "200px" })}>
                <ContactForm profileId={profile.userId} />
              </Hydrate>
            </section>
          </main>
          <LandingFooter name={profile.name} socialLinks={socialLinks} />
        </div>
      </div>
    </>
  );
}
