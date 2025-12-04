import AdminLoginPage from "@/components/pages/admin/login";
import { publicOnlyMiddleware } from "@/lib/auth/middleware";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin_/login")({
  server: { middleware: [publicOnlyMiddleware] },
  component: AdminLoginPage,
});
