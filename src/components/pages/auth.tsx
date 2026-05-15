import { generateAdminSetupTokenAction } from "#/actions/index.ts";
import { ENABLE_ADMIN_SETUP } from "#/config.ts";
import { AuthView, authViewPaths, SignedIn } from "@daveyplate/better-auth-ui";
import { useEffect } from "react";
import { Button } from "../ui/button";

export default function AuthPage({ path }: { path: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 px-6 py-12">
      <AuthView path={path} redirectTo="/admin" />
      {[authViewPaths.SIGN_UP, authViewPaths.SIGN_IN].includes(path) ? (
        <SignedIn>
          <RedirectToAdmin />
        </SignedIn>
      ) : null}
      {path === authViewPaths.SIGN_UP ? (
        <>
          {ENABLE_ADMIN_SETUP ? (
            <Button
              type="button"
              size="sm"
              variant="link"
              className="self-center"
              onClick={() => {
                generateAdminSetupTokenAction();
                alert("Revisa la consola del servidor para el token de configuración");
              }}
            >
              Generar Enlace de Configuración (Solo Dev)
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            variant="link"
            className="self-center"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Volver a mi Portafolio
          </Button>
        </>
      ) : null}
    </main>
  );
}

function RedirectToAdmin() {
  useEffect(() => {
    window.location.href = "/admin";
  }, []);
  return null;
}
