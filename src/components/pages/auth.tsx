import { generateAdminSetupTokenAction } from "#/actions/index.ts";
import { ENABLE_ADMIN_SETUP } from "#/config.ts";
import { Button } from "../ui/button";
import { Auth } from "../auth/auth";
import { viewPaths } from "@better-auth-ui/core";

export default function AuthPage({ path }: { path: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 px-6 py-12">
      <Auth path={path} />
      {/* {[viewPaths.auth.signUp, viewPaths.auth.signIn].includes(path) ? (
        <SignedIn>
          <Navigate to="/admin" />
        </SignedIn>
      ) : null} */}
      {path === viewPaths.auth.signUp ? (
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
