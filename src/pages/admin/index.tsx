import AdminPage from "@/components/admin/admin-page";
import AdminLayout from "@/layout/admin-layout.astro";
import { getAuthSession } from "@/lib/auth/middleware";
import { createFileRoute, redirect } from "@tanstack/react-router";
import * as z from "zod";

export const Route = createFileRoute("/admin/")({
  validateSearch: z.object({
    tab: z.string().optional(),
  }),
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
  loaderDeps: ({ search }) => ({ tab: search.tab }),
  component: AdminIndex,
});

function AdminIndex() {
  const { tab } = Route.useLoaderDeps();

  return (
    <AdminLayout title="Admin Page">
      <AdminPage defaultTab={tab} />
    </AdminLayout>
  );
}
