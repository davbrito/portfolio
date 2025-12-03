import { createAdminSetupLink } from "@/lib/auth/functions";
import { publicOnlyMiddleware } from "@/lib/auth/middleware";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";

export const Route = createFileRoute("/admin/login")({
  server: { middleware: [publicOnlyMiddleware] },
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await signIn.passkey();

      if (error) {
        setError(error.message || "Failed to sign in");
      } else {
        navigate({ to: "/admin" });
      }
    } catch (e) {
      setError("An unexpected error occurred");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn.email(
        { email, password },
        {
          onSuccess: () => {
            navigate({ to: "/admin" });
          },
        },
      );
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to sign in";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

        <div className="flex flex-col gap-3 text-left">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full px-3 py-2 border rounded-md"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full px-3 py-2 border rounded-md"
            disabled={loading}
          />

          <button
            onClick={handleCredentialsLogin}
            disabled={loading || !email || !password}
            className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign in with Email"}
          </button>
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? "Signing in..." : "Sign in with Passkey"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {import.meta.env.VITE_ENABLE_ADMIN_SETUP ? (
          <button
            type="button"
            onClick={async () => {
              await createAdminSetupLink();
              alert("Check server console for setup link");
            }}
            className="mt-8 text-xs text-gray-400 hover:text-gray-600 block mx-auto"
          >
            Generate Setup Link (Dev Only)
          </button>
        ) : null}
      </div>
    </div>
  );
}
