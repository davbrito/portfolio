import { Button } from "@/components/ui/button";
import { authUiProps, useSession } from "@/lib/auth-client";
import { AuthUIProvider, UserButton } from "@daveyplate/better-auth-ui";
import { HomeIcon, LogOutIcon, RotateCcwIcon, SettingsIcon, TerminalIcon } from "lucide-react";
import { useEffect } from "react";

export function AdminHeader() {
  const { data: session, isPending: isPendingSession } = useSession();
  useEffect(() => {
    if (!session && !isPendingSession) {
      window.location.href = "/auth/sign-in";
    }
  }, [isPendingSession, session]);

  const handleReset = () => {
    if (confirm("¿Estás seguro de que deseas restaurar todos los datos por defecto?")) {
      //   reset();
    }
  };

  return (
    <header className="border-primary bg-background sticky top-0 z-50 border-b-2">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <TerminalIcon className="text-primary h-5 w-5" />
          <h1 className="text-foreground text-lg font-bold tracking-wider uppercase">Admin_Panel</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<a href="/" target="_blank" rel="noreferrer" />}
          >
            <HomeIcon />
            Ver sitio
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcwIcon />
            Reset
          </Button>
          <Button size="sm" nativeButton={false} render={<a href="/auth/sign-out" />}>
            <LogOutIcon />
            Logout
          </Button>
          <AuthUIProvider {...authUiProps}>
            <UserButton
              size="icon"
              disableDefaultLinks
              additionalLinks={[
                {
                  href: "/admin",
                  label: "Ajustes",
                  icon: <SettingsIcon />,
                  signedIn: true,
                },
              ]}
            />
          </AuthUIProvider>
        </div>
      </div>
    </header>
  );
}
