import { Button } from "@/components/ui/button";
import Tooltip from "@/components/ui/tooltip";
import { signOut, useSession } from "@/lib/auth-client";
import { Route } from "@/routes/admin";
import { Link } from "@tanstack/react-router";
import {
  HomeIcon,
  LogOutIcon,
  RotateCcwIcon,
  TerminalIcon,
} from "lucide-react";
import { useEffect } from "react";

export function AdminHeader() {
  const navigate = Route.useNavigate();
  const context = Route.useRouteContext();
  const session = useSession().data || context.session;

  useEffect(() => {
    if (!session) {
      navigate({ to: "/admin/login" });
    }
  }, [navigate, session]);

  const handleLogout = () => {
    signOut({
      fetchOptions: {
        onSuccess: () => navigate({ to: "/admin/login" }),
        onError: () => navigate({ to: "/admin/login" }),
      },
    });
  };

  const handleReset = () => {
    if (
      confirm(
        "¿Estás seguro de que deseas restaurar todos los datos por defecto?",
      )
    ) {
      //   reset();
    }
  };

  return (
    <header className="border-primary bg-background sticky top-0 z-50 border-b-2">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <TerminalIcon className="text-primary h-5 w-5" />
          <h1 className="text-foreground text-lg font-bold tracking-wider uppercase">
            Admin_Panel
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            render={<Link to="/" target="_blank" rel="noreferrer" />}
            className="rounded-none border-2 bg-transparent"
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Ver sitio
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="rounded-none border-2 bg-transparent"
          >
            <RotateCcwIcon className="mr-2 h-4 w-4" />
            Reset
          </Button>

          <Button variant="primary" size="sm" onClick={handleLogout}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Logout
          </Button>
          {session && (
            <Tooltip content={session.user.name}>
              <div className="bg-secondary border-secondary-foreground/50 grid size-9 place-items-center rounded-full border-2 font-bold">
                {session.user.name
                  .split(/\W+/)
                  .values()
                  .filter((_, index) => index % 2 === 0)
                  .map((x) => x[0])
                  .take(2)
                  .toArray()
                  .join("")}
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    </header>
  );
}
