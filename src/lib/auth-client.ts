import { passkeyClient as passkeyClientPlugin } from "@better-auth/passkey/client";
import type {
  AuthUIProviderProps,
  SettingsCardClassNames,
} from "@daveyplate/better-auth-ui";
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

const settingCardClassnames: SettingsCardClassNames = {
  base: "rounded-none",
  button: "rounded-none",
  outlineButton: "hover:text-accent-foreground",
  skeleton: "rounded-none",
  cell: "rounded-none",
  input: "rounded-none",
  dialog: {
    content: "rounded-none",
  },
  footer: "rounded-none",
};

export const settingsCardsClassnames = {
  card: settingCardClassnames,
};
