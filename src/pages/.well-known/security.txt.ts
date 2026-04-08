import {
  SECURITY_ACKNOWLEDGMENTS,
  SECURITY_CANONICAL,
  SECURITY_CONTACT,
  SECURITY_ENCRYPTION,
  SECURITY_EXPIRES,
  SECURITY_PREFERRED_LANGUAGES,
} from "astro:env/server";

export const prerender = false;

export function GET() {
  const lines: string[] = [];

  lines.push(`Contact: ${SECURITY_CONTACT}`);
  lines.push(`Expires: ${SECURITY_EXPIRES}`);

  if (SECURITY_ENCRYPTION) {
    lines.push(`Encryption: ${SECURITY_ENCRYPTION}`);
  }

  if (SECURITY_ACKNOWLEDGMENTS) {
    lines.push(`Acknowledgments: ${SECURITY_ACKNOWLEDGMENTS}`);
  }

  if (SECURITY_PREFERRED_LANGUAGES) {
    lines.push(`Preferred-Languages: ${SECURITY_PREFERRED_LANGUAGES}`);
  }

  if (SECURITY_CANONICAL) {
    lines.push(`Canonical: ${SECURITY_CANONICAL}`);
  }

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
