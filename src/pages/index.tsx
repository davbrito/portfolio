import { getMeta } from "@/components/head";
import { LandingPage } from "@/components/pages/landing/landing-page";
import { getPortfolioData } from "@/data/portfolio";
import { setupObfuscatedLinks } from "@/lib/obfuscation";
import { createFileRoute, notFound } from "@tanstack/react-router";
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

function Index() {
  const { data } = Route.useLoaderData();

  useEffect(() => {
    requestIdleCallback(() => {
      setupObfuscatedLinks(data.obKey);
    });
  }, [data.obKey]);

  return <LandingPage data={data} />;
}
