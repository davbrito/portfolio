import AuthPage from "@/components/pages/auth";
import { Providers } from "@/components/providers";
import { viewPaths } from "@better-auth-ui/core";
import { createFileRoute, redirect } from "@tanstack/react-router";

const validAuthPathSegments = new Set([...Object.values(viewPaths.auth)]);
export const Route = createFileRoute("/auth/$path")({
  head: () => ({ meta: [{ title: "Admin" }] }),
  beforeLoad({ params: { path } }) {
    if (!validAuthPathSegments.has(path)) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthRoute,
});

function AuthRoute() {
  const { path } = Route.useParams();
  return (
    <Providers>
      <AuthPage path={path} />
    </Providers>
  );
}
