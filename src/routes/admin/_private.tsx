import { privateMiddleware } from "@/lib/auth/middleware";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_private")({
  server: {
    middleware: [privateMiddleware],
  },
});
