import { passkeyClient } from "@better-auth/passkey/client";
import { createAuthClient } from "better-auth/react";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const authClient = createAuthClient({
  plugins: [passkeyClient(), tanstackStartCookies()],
});

export const { signIn, signUp, signOut, useSession, passkey } = authClient;
