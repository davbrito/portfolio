import AdminPage from "@/components/admin/admin-page";
import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";

export const Route = createFileRoute("/admin/")({
  validateSearch: z.object({
    tab: z.string().optional(),
  }),
  loaderDeps: ({ search }) => ({ tab: search.tab }),
  component: AdminIndex,
});

function AdminIndex() {
  const { tab } = Route.useLoaderDeps();

  return <AdminPage defaultTab={tab} />;
}
