import { authClient, authUiProps } from "@/lib/auth-client";
import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Toaster } from "./ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate() as (to: any) => void;

  return (
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
  );
}
