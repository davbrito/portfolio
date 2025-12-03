"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { createAdminSetupLink } from "@/lib/auth/functions";
import { useIsPasskeysSupported } from "@/lib/auth/passkeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { mutationOptions, useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Fingerprint, Lock, Terminal } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.email({
    error: (ctx) =>
      !ctx.input ? "El correo electrónico es requerido" : "Correo inválido",
  }),
  password: z.string().min(1, { error: "La contraseña es requerida" }),
});

const passkeyLoginOptions = mutationOptions({
  mutationFn: async () => {
    const result = await signIn.passkey({});
    console.log("Passkey login result:", result);
    if (result.error) {
      throw result.error;
    }
    return result.data;
  },
});

export default function AdminLoginPage() {
  const isSupportedPasskey = useIsPasskeysSupported();
  const navigate = useNavigate();

  const passkeyMutation = useMutation(passkeyLoginOptions);

  const form = useForm({
    resolver: zodResolver(schema),
  });
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;
  useEffect(() => void signIn.passkey({ autoFill: true }), []);

  const passkeyLogin = () => {
    passkeyMutation.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: "/admin" });
      },
    });
  };

  const handleCredentialsLogin = async (values: z.infer<typeof schema>) => {
    const { email, password } = values;

    const result = await signIn.email({
      email,
      password,
      fetchOptions: { throw: false },
    });

    if (result.error) {
      form.setError("root", {
        type: "server",
        message:
          result.error.message ||
          result.error.code ||
          "Error al iniciar sesión",
      });
      return;
    }
    navigate({ to: "/admin" });
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <div className="border-primary bg-card w-full max-w-md border-2">
        {/* Barra de encabezado */}
        <div className="bg-primary text-primary-foreground border-primary flex items-center gap-2 border-b-2 px-4 py-3">
          <Terminal className="h-5 w-5" />
          <span className="text-sm font-bold tracking-wider uppercase">
            Panel de Administración
          </span>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-primary/10 border-primary flex h-12 w-12 items-center justify-center border-2">
              <Lock className="text-primary h-6 w-6" />
            </div>
            <div>
              <h1 className="text-foreground text-lg font-bold tracking-wide uppercase">
                Acceso Restringido
              </h1>
              <p className="text-muted-foreground text-sm">
                Ingresa tus credenciales
              </p>
            </div>
          </div>

          {isSupportedPasskey && (
            <div className="mb-6 space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={passkeyLogin}
                disabled={passkeyMutation.isPending}
                className="border-primary bg-primary/5 hover:bg-primary/10 h-14 w-full gap-3 rounded-none border-2 font-bold tracking-wider uppercase"
              >
                <Fingerprint className="h-6 w-6" />
                {passkeyMutation.isPending
                  ? "Verificando..."
                  : "Acceder con Passkey_"}
              </Button>
              {passkeyMutation.error?.message && (
                <div className="text-destructive text-sm">
                  {passkeyMutation.error.message}
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="bg-border h-px flex-1" />
                <span className="text-muted-foreground text-xs tracking-wider uppercase">
                  o usa tu contraseña
                </span>
                <div className="bg-border h-px flex-1" />
              </div>
            </div>
          )}

          <form
            noValidate
            onSubmit={handleSubmit(handleCredentialsLogin)}
            className="flex flex-col gap-4"
          >
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-muted-foreground text-xs tracking-wider uppercase"
              >
                Correo Electrónico_
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="border-border bg-background focus:border-primary rounded-none border-2 font-mono"
                required
                autoComplete="email webauthn"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-muted-foreground text-xs tracking-wider uppercase"
              >
                Contraseña_
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                className="border-border bg-background focus:border-primary rounded-none border-2 font-mono"
                required
                autoComplete="current-password webauthn"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
              {errors.root?.message && (
                <p className="text-destructive font-mono text-sm">
                  <span className="text-destructive/60">[ERROR]</span>{" "}
                  {errors.root?.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full rounded-none font-bold tracking-wider uppercase"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Accediendo..." : "Acceder_"}
            </Button>
            {import.meta.env.VITE_ENABLE_ADMIN_SETUP ? (
              <Button
                type="button"
                size="sm"
                variant="link"
                className="self-center"
                onClick={async () => {
                  await createAdminSetupLink();
                  alert(
                    "Revisa la consola del servidor para el enlace de configuración",
                  );
                }}
              >
                Generar Enlace de Configuración (Solo Dev)
              </Button>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
