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
import { ArrowDown } from "lucide-react";
import { useEffect } from "react";

export const prerender = false;

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
      <div className="bg-background text-foreground relative min-h-screen font-sans">
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
            <pre></pre>
            <section className="mx-auto max-w-4xl">
              <Hero socialLinks={socialLinks} profile={profile} />
            </section>

            <div className="flex justify-center" aria-hidden>
              <ArrowDown className="text-muted-foreground h-5 w-5 animate-bounce" />
            </div>

            <section id="sobre-mi" className="mx-auto max-w-4xl">
              <SectionHeader number={1} title="Sobre mí" />

              <About profile={profile} />
            </section>

            <section id="experiencia" className="mx-auto max-w-4xl">
              <SectionHeader number={2} title="Experiencia" />

              <Experience experience={experience} />
            </section>

            <section id="tecnologias" className="mx-auto max-w-4xl">
              <SectionHeader number={3} title="Tecnologías" />

              <Technologies technologies={technologies} />
            </section>

            <section id="proyectos" className="mx-auto max-w-4xl">
              <SectionHeader number={4} title="Proyectos" />

              <Projects projects={projects} />
            </section>

            <section id="contacto" className="mx-auto max-w-prose space-y-8">
              <ContactForm profileId={profile.userId} />
            </section>
          </main>
          <LandingFooter name={profile.name} socialLinks={socialLinks} />
        </div>
      </div>
    </>
  );
}
