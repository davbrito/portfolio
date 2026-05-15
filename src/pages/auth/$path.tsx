import AuthPage from "@/components/pages/auth";
import { authViewPaths } from "@daveyplate/better-auth-ui";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/$path")({
  head: () => ({ meta: [{ title: "Admin" }] }),
  beforeLoad({ params: { path } }) {
    if (!Object.values(authViewPaths).includes(path)) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthRoute,
});

function AuthRoute() {
  const { path } = Route.useParams();
  return <AuthPage path={path} />;
}
