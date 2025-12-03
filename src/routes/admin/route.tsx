import { AdminHeader } from "@/components/pages/admin/admin-header";
import { privateMiddleware } from "@/lib/auth/middleware";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  server: {
    middleware: [privateMiddleware],
  },
  beforeLoad(ctx) {
    return {
      session: ctx.serverContext?.session,
    };
  },
  component: AdminComponent,
});

function AdminComponent() {
  return (
    <>
      <AdminHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </>
  );
}
