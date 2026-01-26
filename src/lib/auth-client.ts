import { passkeyClient as passkeyClientPlugin } from "@better-auth/passkey/client";
import type { AuthUIProviderProps } from "@daveyplate/better-auth-ui";
import { CF_TURNSTILE_SITE_KEY } from "astro:env/client";
import { createAuthClient } from "better-auth/react";
import { authLocalization } from "./auth/localization";

export const authClient = createAuthClient({
  plugins: [passkeyClientPlugin()],
});

export const { signIn, signUp, signOut, useSession, passkey: passkeyClient } = authClient;

export const authUiProps: Omit<AuthUIProviderProps, "children"> = {
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
