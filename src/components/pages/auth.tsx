import { authUiProps } from "@/lib/auth-client";
import { AuthUIProvider, AuthView, SignedIn } from "@daveyplate/better-auth-ui";
import { actions } from "astro:actions";
import { ENABLE_ADMIN_SETUP } from "astro:env/client";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Toaster } from "../ui/sonner";

export default function AuthPage({ path }: { path: string }) {
  return (
    <AuthUIProvider {...authUiProps}>
      <main className="flex min-h-screen flex-col items-center justify-center gap-2 px-6 py-12">
        <AuthView path={path} redirectTo="/admin" />
        {["sign-up", "sign-in"].includes(path) ? (
          <SignedIn>
            <RedirectToAdmin />
          </SignedIn>
        ) : null}
        {path === "sign-in" ? (
          <>
            {ENABLE_ADMIN_SETUP ? (
              <Button
                type="button"
                size="sm"
                variant="link"
                className="self-center"
                onClick={() => {
                  actions.admin.setupLink();
                  alert(
                    "Revisa la consola del servidor para el enlace de configuración",
                  );
                }}
              >
                Generar Enlace de Configuración (Solo Dev)
              </Button>
            ) : null}
          </>
        ) : null}
      </main>
      <Toaster />
    </AuthUIProvider>
  );
}

function RedirectToAdmin() {
  useEffect(() => {
    window.location.href = "/admin";
  }, []);
  return null;
}
