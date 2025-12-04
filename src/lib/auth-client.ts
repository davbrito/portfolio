import { passkeyClient as passkeyClientPlugin } from "@better-auth/passkey/client";
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
