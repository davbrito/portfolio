import { AdminPasskeys } from "@/components/pages/admin/admin-passkeys";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs";
import { listPasskeys } from "@/lib/auth/functions";
import {
  createFileRoute,
  ErrorComponentProps,
  Link,
} from "@tanstack/react-router";
import { BarChart3, Key, Settings, Users } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
  errorComponent: ErrorBoundary,
  loader: async () => await listPasskeys(),
});

function RouteComponent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
        <p className="text-muted-foreground">
          Gestiona tu aplicación, usuarios y configuraciones de seguridad.
        </p>
      </div>

      <Tabs defaultSelectedId="passkeys" className="flex-col">
        <TabList className="mb-4 flex-wrap">
          <Tab id="dashboard" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Resumen
          </Tab>
          <Tab id="passkeys" className="gap-2">
            <Key className="h-4 w-4" />
            Passkeys
          </Tab>
          <Tab id="users" className="gap-2">
            <Users className="h-4 w-4" />
            Usuarios
          </Tab>
          <Tab id="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Configuración
          </Tab>
        </TabList>

        <TabPanel tabId="dashboard">
          <DashboardSection />
        </TabPanel>
        <TabPanel tabId="passkeys">
          <AdminPasskeys />
        </TabPanel>
        <TabPanel tabId="users">
          <UsersSection />
        </TabPanel>
        <TabPanel tabId="settings">
          <SettingsSection />
        </TabPanel>
      </Tabs>
    </div>
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

function ErrorBoundary({ error, reset, info }: ErrorComponentProps) {
  return (
    <div className="flex min-h-screen items-center justify-center text-red-500">
      An unexpected error occurred in the admin dashboard.
      <pre className="whitespace-pre-wrap">{error.message}</pre>
      <pre className="whitespace-pre-wrap">{info?.componentStack}</pre>
      <Link to="/admin">Go to Home</Link>
      <button
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={() => reset()}
      >
        Try Again
      </button>
    </div>
  );
}
