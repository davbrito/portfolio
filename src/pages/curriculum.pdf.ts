import { CurriculumDocument } from "@/components/cv/curriculum-document";
import { getPortfolioData } from "@/data/portfolio";
import { validateTurnstileToken } from "@/lib/captcha";
import { renderToBuffer } from "@react-pdf/renderer";
import type { APIContext } from "astro";
import deburr from "lodash-es/deburr.js";
import snakeCase from "lodash-es/snakeCase.js";
import { createElement } from "react";

export const prerender = false;

export async function GET(ctx: APIContext) {
  const token = ctx.url.searchParams.get("cf-turnstile-response") || "";

  const validation = await validateTurnstileToken(token, ctx.clientAddress);
  if (!validation.success) {
    return new Response("Turnstile verification failed.", { status: 403 });
  }

  const data = await getPortfolioData();

  if (!data || !data.profile.active) {
    return new Response("Profile is not active or not found.", { status: 404 });
  }

  const pdfBuffer = await renderToBuffer(
    createElement(CurriculumDocument, { data }) as unknown as Parameters<typeof renderToBuffer>[0],
  );

  const filename = `curriculum-${deburr(snakeCase(data.profile.name)) || "profile"}.pdf`;

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
