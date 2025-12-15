import { passkeyClient as passkeyClientPlugin } from "@better-auth/passkey/client";
import type { AuthUIProviderProps } from "@daveyplate/better-auth-ui";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [passkeyClientPlugin()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  passkey: passkeyClient,
} = authClient;

export const authUiProps: Omit<AuthUIProviderProps, "children"> = {
  authClient,
  passkey: true,
  account: {
    basePath: "/admin",
  },
  avatar: true,
  navigate(href): void {
    if (!(window as any).__navigated) {
      window.location.href = href;
      (window as any).__navigated = true;
    }
  },
};
