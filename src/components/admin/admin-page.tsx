import { Card, CardContent, CardHeader } from "@/components/ui/card";
import * as tabs from "@/components/ui/tabs";
import { authUiProps } from "@/lib/auth-client";
import { QueryProvider } from "@/lib/query";
import {
  AccountSettingsCards,
  AuthUIProvider,
  SecuritySettingsCards,
  type SettingsCardClassNames,
} from "@daveyplate/better-auth-ui";
import {
  BarChart3,
  IdCard,
  LockIcon,
  Settings,
  UserIcon,
  Users,
} from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { Toaster } from "../ui/sonner";
import { ProfileSettings } from "./profile-settings";

const settingCardClassnames: SettingsCardClassNames = {
  // base: "rounded-none",
  // button: "rounded-none",
  // // button: buttonVariants(),
  outlineButton: "hover:text-accent-foreground",
  // skeleton: "rounded-none",
  // cell: "rounded-none",
  // input: "rounded-none",
  // dialog: {
  //   content: "rounded-none",
  // },
  // footer: "rounded-none",
};

export const settingsCardsClassnames = {
  card: settingCardClassnames,
};

export default function AdminPage() {
  return (
    <QueryProvider>
      <AuthUIProvider {...authUiProps}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Panel de Control
            </h1>
            <p className="text-muted-foreground">
              Gestiona tu aplicación, usuarios y configuraciones de seguridad.
            </p>
          </div>

          <tabs.Tabs defaultValue="profile" className="dark flex-col">
            <tabs.TabsList className="mb-4 w-full flex-wrap *:flex-1">
              <tabs.TabsTrigger value="profile">
                <IdCard />
                Perfil
              </tabs.TabsTrigger>
              <tabs.TabsTrigger value="dashboard">
                <BarChart3 />
                Resumen
              </tabs.TabsTrigger>
              <tabs.TabsTrigger value="users">
                <Users />
                Usuarios
              </tabs.TabsTrigger>
              <tabs.TabsTrigger value="settings">
                <Settings />
                Configuración
              </tabs.TabsTrigger>
              <tabs.TabsTrigger value="account">
                <UserIcon />
                Cuenta
              </tabs.TabsTrigger>
              <tabs.TabsTrigger value="security">
                <LockIcon />
                Seguridad
              </tabs.TabsTrigger>
            </tabs.TabsList>

            <tabs.TabsContent value="profile">
              <Suspense fallback={<Skeleton />}>
                <ProfileSettings />
              </Suspense>
            </tabs.TabsContent>
            <tabs.TabsContent value="dashboard">
              <DashboardSection />
            </tabs.TabsContent>
            <tabs.TabsContent value="users">
              <UsersSection />
            </tabs.TabsContent>
            <tabs.TabsContent value="settings">
              <SettingsSection />
            </tabs.TabsContent>
            <tabs.TabsContent value="account">
              <AccountSettingsCards classNames={settingsCardsClassnames} />
            </tabs.TabsContent>
            <tabs.TabsContent value="security">
              <SecuritySettingsCards classNames={settingsCardsClassnames} />
            </tabs.TabsContent>
          </tabs.Tabs>
        </div>

        <Toaster />
      </AuthUIProvider>
    </QueryProvider>
  );
}

function DashboardSection() {
  return (
    <Card>
      <CardHeader>
        <h2 className="heading-3">Resumen del Sistema</h2>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card text-card-foreground rounded-xl border p-6 shadow">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium tracking-tight">
                Usuarios Totales
              </h3>
              <Users className="text-muted-foreground h-4 w-4" />
            </div>
            <div className="text-2xl font-bold">--</div>
            <p className="text-muted-foreground text-xs">
              +0% desde el mes pasado
            </p>
          </div>
          {/* Más tarjetas de estadísticas podrían ir aquí */}
        </div>
      </CardContent>
    </Card>
  );
}

function UsersSection() {
  return (
    <Card>
      <CardHeader>
        <h2 className="heading-3">Gestión de Usuarios</h2>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          La gestión de usuarios estará disponible próximamente.
        </p>
      </CardContent>
    </Card>
  );
}

function SettingsSection() {
  return (
    <Card>
      <CardHeader>
        <h2 className="heading-3">Configuración del Sistema</h2>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Las configuraciones globales estarán disponibles próximamente.
        </p>
      </CardContent>
    </Card>
  );
}
