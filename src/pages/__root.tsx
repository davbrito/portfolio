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
      {
        name: "description",
        content: "Portfalio profesional - Desarrollador fullstack con experiencia en TypeScript, React, Node.js y más. Explora mis proyectos, habilidades y experiencia profesional.",
      },
      { title: "Portfalio" },
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
  headers: () => ({
    "X-Frame-Options": "SAMEORIGIN",
    "Content-Security-Policy": [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' https://challenges.cloudflare.com",
      "frame-src https://challenges.cloudflare.com",
      "connect-src 'self' https://challenges.cloudflare.com",
    ].join('; '),
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cross-Origin-Opener-Policy": "same-origin",
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
