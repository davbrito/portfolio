import { passkey, signOut, useSession } from "@/lib/auth-client";
import { Passkey } from "@better-auth/passkey";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createClientOnlyFn } from "@tanstack/react-start";
import { useState } from "react";

const listPasskeys = createClientOnlyFn(() => passkey.listUserPasskeys());

export const Route = createFileRoute("/admin/_private/")({
  component: RouteComponent,
  loader: async () => listPasskeys(),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const session = useSession();
  const user = session.data?.user;
  const userLabel = user?.name || user?.email || "User";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{userLabel}</span>
            <button
              type="button"
              onClick={async () => {
                signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      navigate({ to: "/admin/login" });
                    },
                    onError: () => {
                      navigate({ to: "/admin/login" });
                    },
                  },
                });
              }}
              className="px-3 py-1.5 text-sm rounded-md bg-gray-900 text-white hover:bg-black"
            >
              Logout
            </button>
          </div>
        </div>

        <PasskeysManager />
      </div>
    </div>
  );
}

function PasskeysManager() {
  const router = useRouter();
  const { error, data } = Route.useLoaderData();
  const [newLabel, setNewLabel] = useState("");
  const loading = false;

  const items = data || [];

  const handleRename = async (id: string, name: string) => {
    await passkey.updatePasskey({ id, name });
    router.invalidate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this passkey?")) return;
    await passkey.deletePasskey({ id });
    await router.invalidate();
  };
  const handleRegister = async () => {
    await passkey.addPasskey({ name: newLabel || undefined });
    setNewLabel("");
    await router.invalidate();
  };
  return (
    <section className="bg-white border rounded-lg p-5">
      <h2 className="text-lg font-semibold mb-1">Passkeys</h2>
      <p className="text-sm text-gray-600 mb-4">
        Add a passkey to sign in quickly on this device. You can create multiple
        passkeys and remove them anytime.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Label (e.g., MacBook Touch ID)"
          className="flex-1 px-3 py-2 border rounded-md"
          disabled={loading}
        />
        <button
          type="button"
          onClick={handleRegister}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-black disabled:opacity-50"
        >
          {loading ? "Registering…" : "Register Passkey"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error.message}
        </div>
      )}

      <div className="divide-y border rounded-md overflow-hidden">
        {loading && items.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">No passkeys yet.</div>
        ) : (
          items.map((pk) => (
            <PasskeyRow
              key={pk.id}
              item={pk}
              busy={loading}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </section>
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
  const created = item.createdAt
    ? new Date(item.createdAt).toLocaleString()
    : "";

  return (
    <div className="p-4 flex flex-col sm:flex-row sm:items-start gap-3">
      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          disabled={busy}
        />
        <div className="mt-1 text-xs text-gray-500">
          <span className="mr-3">Created: {created || "—"}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onRename(item.id, name)}
          disabled={busy}
          className="px-3 py-2 text-sm rounded-md border hover:bg-gray-50 disabled:opacity-50"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          disabled={busy}
          className="px-3 py-2 text-sm rounded-md border text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
