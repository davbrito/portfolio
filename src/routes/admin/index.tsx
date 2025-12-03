import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { passkey } from "@/lib/auth-client";
import { Passkey } from "@better-auth/passkey";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  ErrorComponentProps,
  Link,
  useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { useState } from "react";

const listPasskeys = createServerFn({ method: "GET" }).handler(() => {
  const headers = getRequestHeaders();
  return auth.api.listPasskeys({ headers });
});

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
  errorComponent: ErrorBoundary,
  loader: async () => await listPasskeys(),
});

function RouteComponent() {
  return (
    <>
      <PasskeysManager />
    </>
  );
}

function PasskeysManager() {
  const router = useRouter();
  const data = Route.useLoaderData();
  const [newLabel, setNewLabel] = useState("");
  const loading = false;

  const items = data || [];

  const updatePasskey = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      passkey.updatePasskey({ id, name, fetchOptions: { throw: true } }),
    onSuccess() {
      router.invalidate();
    },
  });

  const deletePasskey = useMutation({
    mutationFn: (id: string) =>
      passkey.deletePasskey({ id, fetchOptions: { throw: true } }),
    onSuccess() {
      router.invalidate();
    },
  });

  const registerPasskey = useMutation({
    mutationFn: (name: string) => {
      return passkey.addPasskey({
        name: name || undefined,
        fetchOptions: { throw: true },
      });
    },
    onSuccess() {
      router.invalidate();
      setNewLabel("");
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this passkey?")) return;
    deletePasskey.mutate(id);
  };

  const handleRegister = async () => {
    registerPasskey.mutate(newLabel);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="heading-3">Passkeys</h2>
        <p className="caption">
          Add a passkey to sign in quickly on this device. You can create
          multiple passkeys and remove them anytime.
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <Input
            className="w-auto grow"
            id="new-passkey-label"
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Label (e.g., MacBook Touch ID)"
            disabled={loading}
          />
          <Button onClick={handleRegister} disabled={loading}>
            {loading ? "Registering…" : "Register Passkey"}
          </Button>
        </div>

        <div className="divider radius-md">
          {items.map((pk) => (
            <PasskeyRow
              key={pk.id}
              item={pk}
              busy={
                updatePasskey.isPending && updatePasskey.variables?.id === pk.id
              }
              onRename={(id, name) => updatePasskey.mutate({ id, name })}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PasskeyRow({
  item,
  busy,
  onRename,
  onDelete,
}: {
  item: Passkey;
  busy: boolean;
  onRename: (id: string, name: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}) {
  const [name, setName] = useState(item.name ?? "Untitled Passkey");
  const created = item.createdAt ? item.createdAt.toLocaleString() : "";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="min-w-0 flex-1">
        <Input
          type="text"
          id={`passkey-name-${item.id}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
        />
        <div className="mt-1 text-xs text-gray-500">
          <span className="mr-3">Created: {created || "—"}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onRename(item.id, name)}
          disabled={busy}
        >
          Save
        </Button>
        <Button
          variant="destructive"
          onClick={() => onDelete(item.id)}
          disabled={busy}
        >
          Delete
        </Button>
      </div>
    </div>
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
