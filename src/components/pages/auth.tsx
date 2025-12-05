import { authUiProps } from "@/lib/auth-client";
import { AuthUIProvider, AuthView } from "@daveyplate/better-auth-ui";

export default function AuthPage({ path }: { path: string }) {
  return (
    <AuthUIProvider {...authUiProps}>
      <main className="flex min-h-screen items-center justify-center px-6 py-12">
        <AuthView path={path} redirectTo="/admin" />
      </main>
    </AuthUIProvider>
  );
}
