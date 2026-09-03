import { validateTurnstileToken } from "@/lib/captcha";
import { getStorageObject } from "@/lib/storage";
import { createFileRoute } from "@tanstack/react-router";
import Negotiator from "negotiator";

const CURRICULUM_KEYS = {
  en: "current/cv-en.pdf",
  es: "current/cv-es-photo.pdf",
} as const;

function pickCurriculumKey(acceptLanguage: string | null): string {
  const negotiator = new Negotiator({ headers: { "accept-language": acceptLanguage ?? "" } });
  const language = negotiator.language(["es", "en"]);
  return CURRICULUM_KEYS[language as keyof typeof CURRICULUM_KEYS] ?? CURRICULUM_KEYS.es;
}

export const Route = createFileRoute("/curriculum.pdf")({
  server: {
    handlers: {
      async GET({ request, context }) {
        const token = new URL(request.url).searchParams.get("cf_turnstile_token");
        if (!token) return new Response("Access denied.", { status: 403 });

        const verification = await validateTurnstileToken(token, context.ip);
        if (!verification.success) return new Response("Access denied.", { status: 403 });

        const key = pickCurriculumKey(request.headers.get("accept-language"));

        const upstream = await getStorageObject(key);
        if (!upstream.ok || !upstream.body) {
          return new Response("Curriculum not available.", { status: 502 });
        }

        const filename = key.split("/").pop() ?? "curriculum.pdf";
        const contentLength = upstream.headers.get("Content-Length");

        return new Response(upstream.body, {
          headers: {
            "Content-Type": "application/pdf",
            ...(contentLength ? { "Content-Length": contentLength } : {}),
            "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(filename)}`,
          },
        });
      },
    },
  },
});
