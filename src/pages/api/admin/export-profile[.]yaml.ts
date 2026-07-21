import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/auth/helpers";
import { exportProfileYaml } from "@/service/profile";
import { createFileRoute } from "@tanstack/react-router";
import deburr from "lodash-es/deburr.js";
import snakeCase from "lodash-es/snakeCase.js";

export const Route = createFileRoute("/api/admin/export-profile.yaml")({
  server: {
    handlers: {
      async GET({ request }) {
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session?.user || !isAdminEmail(session.user.email)) {
          return new Response("Unauthorized", { status: 401 });
        }

        const yaml = await exportProfileYaml(session.user.id);
        if (yaml === null) {
          return new Response("Profile not found", { status: 404 });
        }

        const filename = `profile-${deburr(snakeCase(session.user.name)) || "export"}.yaml`;

        return new Response(yaml, {
          headers: {
            "Content-Type": "application/yaml; charset=utf-8",
            "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
          },
        });
      },
    },
  },
});
