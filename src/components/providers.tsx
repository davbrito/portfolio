import { CF_TURNSTILE_SITE_KEY } from "#/config.ts";
import { authClient } from "@/lib/auth-client";
import { authLocalization } from "@/lib/auth/localization";
import { QueryProvider } from "@/lib/query";
import { AuthUIProvider, type AuthUIProviderProps } from "@daveyplate/better-auth-ui";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Toaster } from "./ui/sonner";

const authUiProps: Omit<AuthUIProviderProps, "children"> = {
  authClient,
  passkey: true,
  account: {
    basePath: "/admin",
  },
  avatar: true,
  captcha: {
    provider: "cloudflare-turnstile",
    siteKey: CF_TURNSTILE_SITE_KEY,
  },
  localization: authLocalization,
  additionalFields: {
    adminToken: {
      type: "string",
      label: "Token de Creación de Admin",
      description: "Proporcione el token secreto para crear una cuenta de administrador",
      required: true,
    },
  },
  signUp: {
    fields: ["name", "adminToken"],
  },
};

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate() as (to: any) => void;

  return (
    <QueryProvider>
      <AuthUIProvider
        {...authUiProps}
        authClient={authClient}
        redirectTo="/admin"
        navigate={navigate}
        // plugins={
        //   [
        //     // apiKeyPlugin(),
        //     // passkeyPlugin(),
        //     // usernamePlugin(),
        //     // deleteUserPlugin(),
        //     // themePlugin({ useTheme }),
        //   ]
        // }
        Link={Link as any}
      >
        {children}

        <Toaster />
      </AuthUIProvider>
    </QueryProvider>
  );
}
