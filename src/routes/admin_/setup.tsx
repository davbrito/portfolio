import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";
import { adminTokenMiddleware } from "@/lib/auth/middleware";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, EyeOff, TerminalIcon } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/admin_/setup")({
  server: { middleware: [adminTokenMiddleware] },
  component: AdminSetup,
  validateSearch: z.object({
    token: z.string().nonempty(),
  }),
});

const schema = z.object({
  name: z.string({ error: "El nombre es requerido" }),
  email: z.email({ error: "Correo inválido" }),
  password: z
    .string({ error: "La contraseña es requerida" })
    .min(8, { error: "La contraseña debe tener al menos 8 caracteres" }),
});

function AdminSetup() {
  const formId = useId();
  const navigate = Route.useNavigate();
  const { token } = Route.useSearch();
  const [showPassword, setShowPassword] = useState(false);

  async function submit(data: z.infer<typeof schema>) {
    const result = await signUp.email({
      email: data.email,
      name: data.name,
      password: data.password,
      fetchOptions: {
        throw: false,
        headers: {
          "x-admin-token": token,
        },
      },
    });

    if (result.error) {
      return form.setError("root", {
        type: "server",
        message:
          result.error.message ||
          result.error.code ||
          "Error al crear el usuario admin",
      });
    }

    navigate({ to: "/admin/login" });
  }

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const { register, formState } = form;
  const { errors, isSubmitting } = formState;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="border-secondary w-full max-w-md">
        <CardHeader className="bg-secondary text-secondary-foreground border-secondary flex items-center gap-2 border-b-2 px-4 py-3">
          <TerminalIcon className="h-5 w-5" />
          <span className="text-sm font-bold tracking-wider uppercase">
            Configurar Cuenta de Admin
          </span>
        </CardHeader>
        <CardContent>
          <form
            id={formId}
            onSubmit={form.handleSubmit(submit)}
            className="space-y-2"
          >
            <div className="space-y-2">
              <Label htmlFor={`${formId}-name`}>Nombre</Label>
              <Input
                id={`${formId}-name`}
                type="text"
                {...register("name")}
                placeholder="Tu nombre"
                autoComplete="name"
                aria-errormessage={`${formId}-name-error`}
              />
              <div
                id={`${formId}-name-error`}
                className="text-destructive text-sm empty:hidden"
              >
                {errors.name?.message}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${formId}-email`}>Correo</Label>
              <Input
                id={`${formId}-email`}
                type="email"
                {...register("email")}
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
              />
              <div
                id={`${formId}-email-error`}
                className="text-destructive text-sm empty:hidden"
              >
                {errors.email?.message}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${formId}-password`}>Contraseña</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id={`${formId}-password`}
                  {...register("password")}
                  aria-errormessage={`${formId}-password-error`}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="new-password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute top-1/2 right-2 -translate-y-1/2 px-2"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  title={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
              <div
                id={`${formId}-password-error`}
                className="text-destructive text-sm empty:hidden"
              >
                {errors.password?.message}
              </div>
            </div>
            {!!errors.root && (
              <div className="text-destructive my-4 pl-2">
                {errors.root.message}
              </div>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              form={formId}
            >
              {isSubmitting ? "Creando..." : "Crear Admin"}
            </Button>
          </form>
          <Button
            variant="link"
            render={<Link to="/admin/login" />}
            size="sm"
            className="mx-auto mt-2 block w-fit"
          >
            Volver al Inicio de Sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
