import { ErrorPage } from "@/components/error-page";
import globalCss from "@/styles/global.css?url";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Hydrate } from "@tanstack/react-start";
import { idle } from "@tanstack/react-start/hydration";
import { Analytics } from "@vercel/analytics/react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Portfolio" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: globalCss,
      },
      {
        rel: "icon",
        href: "/favicon.png",
        type: "image/png",
      },
    ],
  }),
  shellComponent: SiteLayout,
  errorComponent: ErrorPage,
});

function SiteLayout() {
  return (
    <html lang="es" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Hydrate when={idle()}>
          <Analytics mode={import.meta.env.DEV ? "development" : "production"} />
        </Hydrate>
        <Scripts />
      </body>
    </html>
  );
}
