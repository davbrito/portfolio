import { Providers } from "@/components/providers";
import AdminLayout from "@/layout/admin-layout";
import { getAuthSession } from "@/lib/auth/middleware";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Page" }] }),
  async beforeLoad({ location, abortController: { signal } }) {
    const sessionData = await getAuthSession({ signal });
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
  return (
    <Providers>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </Providers>
  );
}
