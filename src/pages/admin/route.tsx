import AdminPage from "@/components/admin/admin-page";
import { Providers } from "@/components/providers";
import AdminLayout from "@/layout/admin-layout";
import { getAuthSession } from "@/lib/auth/middleware";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import * as z from "zod";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Page" }] }),
  async beforeLoad({ location }) {
    const sessionData = await getAuthSession();
    if (!sessionData) {
      throw redirect({
        to: "/auth/$path",
        params: { path: "sign-in" },
        search: {
          from: location.href,
        },
      });
    }

    return { context: sessionData };
  },
  component: AdminIndex,
});

function AdminIndex() {
  const { tab } = Route.useLoaderDeps();

  return (
    <Providers>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </Providers>
  );
}
