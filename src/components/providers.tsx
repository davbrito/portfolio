import { TurnstileWidget } from "#/components/turnstile-widget.tsx";
import { authClient } from "#/lib/auth-client.ts";
import { authLocalization, passkeyLocalization, settingsLocalization } from "#/lib/auth/localization.ts";
import { QueryProvider } from "#/lib/query.ts";
import { passkeyPlugin } from "#/lib/auth/passkey-plugin.ts";
import type { AuthProviderProps } from "@better-auth-ui/react";
import { captchaPlugin } from "@better-auth-ui/react/plugins";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AuthProvider } from "./auth/auth-provider";
import { Toaster } from "./ui/sonner";

const authUiProps: Omit<AuthProviderProps<typeof authClient>, "children" | "navigate"> = {
  authClient,
  // account: {
  //   basePath: "/admin",
  // },
  redirectTo: "/admin",
  avatar: { enabled: true },
  localization: { auth: authLocalization, settings: settingsLocalization },
  additionalFields: [
    {
      name: "adminToken",
      type: "string",
      label: "Token de Creación de Admin",
      placeholder: "Proporcione el token secreto para crear una cuenta de administrador",
      required: true,
      signUp: true,
      profile: false,
    },
  ],

  plugins: [
    passkeyPlugin({ localization: passkeyLocalization }),
    captchaPlugin({ render: TurnstileWidget }),
    // themePlugin({ useTheme }),
  ],
  Link,
};

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <QueryProvider>
      <AuthProvider {...authUiProps} navigate={navigate}>
        {children}

        <Toaster />
      </AuthProvider>
    </QueryProvider>
  );
}
