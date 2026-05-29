import AdminPage from "@/components/admin/admin-page";
import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";

export const Route = createFileRoute("/admin/")({
  validateSearch: z.object({
    tab: z.string().optional(),
  }),
  component: AdminIndex,
});

function AdminIndex() {
  const navigate = Route.useNavigate();
  const tab = Route.useSearch({ select: (s) => s.tab || "profile" });

  const onChangeTab = (value: string) => {
    navigate({ search: { tab: value } });
  };

  return <AdminPage tab={tab} onChangeTab={onChangeTab} />;
}
