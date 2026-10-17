import { getStorageObject } from "@/lib/storage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/assets/$")({
  server: {
    handlers: {
      async GET({ request, params }: { request: Request; params: { _splat?: string } }) {
        const filename = params._splat || new URL(request.url).pathname.replace(/^\/profile\/assets\/?/, "");

        if (!filename) {
          return new Response("Asset not found", { status: 404 });
        }

        const upstream = await getStorageObject(`profile/assets/${filename}`);
        if (!upstream.ok || !upstream.body) {
          return new Response("Asset not found", { status: 404 });
        }

        const contentType = upstream.headers.get("Content-Type") || "application/octet-stream";
        const contentLength = upstream.headers.get("Content-Length");

        return new Response(upstream.body, {
          headers: {
            "Content-Type": contentType,
            ...(contentLength ? { "Content-Length": contentLength } : {}),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
