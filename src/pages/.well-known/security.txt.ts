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
  // Validate the Expires field is a valid RFC 3339 date-time
  const expires = new Date(SECURITY_EXPIRES);
  if (isNaN(expires.getTime())) {
    return new Response("SECURITY_EXPIRES is not a valid RFC 3339 date-time.", { status: 500 });
  }

  const lines: string[] = [];

  lines.push(`Contact: ${SECURITY_CONTACT}`);
  lines.push(`Expires: ${expires.toISOString()}`);

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
      "Cache-Control": "max-age=3600",
    },
  });
}
