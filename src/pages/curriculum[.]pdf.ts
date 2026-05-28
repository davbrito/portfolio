import { CurriculumDocument } from "@/components/cv/curriculum-document";
import { getPortfolioData } from "@/data/portfolio";
import { isBot } from "@/lib/botid/validation";
import { renderToBuffer } from "@react-pdf/renderer";
import { getCache } from "@vercel/functions";
import { createFileRoute } from "@tanstack/react-router";
import deburr from "lodash-es/deburr.js";
import snakeCase from "lodash-es/snakeCase.js";
import { createElement } from "react";

const CACHE_KEY = "curriculum-pdf";

export const Route = createFileRoute("/curriculum.pdf")({
  server: {
    handlers: {
      async GET() {
        if (await isBot()) return new Response("Access denied.", { status: 403 });

        const data = await getPortfolioData();
        if (!data || !data.profile.active) {
          return new Response("Profile is not active or not found.", { status: 404 });
        }

        const cache = getCache();
        const cachedPdf = (await cache.get(CACHE_KEY)) as Uint8Array<ArrayBuffer> | null;
        console.log("Cached PDF found:", cachedPdf, cachedPdf&& Object.getPrototypeOf(cachedPdf).constructor.name);
        const filename = `curriculum-${deburr(snakeCase(data.profile.name)) || "profile"}.pdf`;

        if (cachedPdf) {
          return new Response(cachedPdf, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Length": String(cachedPdf.byteLength),
              "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(filename)}`,
              "Cache-Control": "private, no-store, max-age=0",
            },
          });
        }

        const pdfBuffer = await renderToBuffer(
          createElement(CurriculumDocument, { data }) as unknown as Parameters<typeof renderToBuffer>[0],
        );

        const pdfBytes = new Uint8Array(pdfBuffer);

        await cache.set(CACHE_KEY, pdfBytes, {
          name: "Curriculum PDF",
          tags: ["curriculum-pdf"],
          ttl: 60 * 60 * 24 * 90,
        });

        return new Response(pdfBytes, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Length": String(pdfBytes.byteLength),
            "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(filename)}`,
            "Cache-Control": "private, no-store, max-age=0",
          },
        });
      },
    },
  },
});
