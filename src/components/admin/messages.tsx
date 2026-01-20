"use client";

import { useActionQuery } from "@/lib/query";
import { useMutation } from "@tanstack/react-query";
import { actions } from "astro:actions";
import { Eye, EyeOff, Layers } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Spinner } from "../ui/spinner";

function formatDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("es-VE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function MessagesSection() {
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const { data, isLoading } = useActionQuery(actions.messages.list, { filter });
  const markReadMutation = useMutation({
    mutationFn: actions.messages.markRead.orThrow,
    onSuccess(data, variables, onMutateResult, context) {
      context.client.invalidateQueries({ queryKey: [actions.messages.list.toString()] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: actions.messages.delete.orThrow,
    onSuccess(data, variables, onMutateResult, context) {
      context.client.invalidateQueries({ queryKey: [actions.messages.list.toString()] });
    },
  });

  const filteredMessages =
    filter === "all"
      ? data
      : filter === "read"
        ? data?.filter((message) => !!message.readAt)
        : data?.filter((message) => !message.readAt);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="heading-3">Mensajes recibidos</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={filter === "all" ? "secondary" : "ghost"}
              onClick={() => setFilter("all")}
            >
              <Layers className="h-4 w-4" />
              Todos
            </Button>
            <Button
              type="button"
              size="sm"
              variant={filter === "unread" ? "secondary" : "ghost"}
              onClick={() => setFilter("unread")}
            >
              <EyeOff className="h-4 w-4" />
              No leídos
            </Button>
            <Button
              type="button"
              size="sm"
              variant={filter === "read" ? "secondary" : "ghost"}
              onClick={() => setFilter("read")}
            >
              <Eye className="h-4 w-4" />
              Leídos
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        {isLoading ? (
          <div className="m-auto p-6">
            <Spinner />
          </div>
        ) : !filteredMessages?.length ? (
          <p className="text-muted-foreground">No hay mensajes por mostrar.</p>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => {
              const isRead = !!message.readAt;
              return (
                <div key={message.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{message.subject}</p>
                      <p className="text-muted-foreground text-xs">
                        {message.name} · {message.email}
                      </p>
                    </div>
                    <div className="text-muted-foreground text-right text-xs">
                      <p>{formatDate(message.createdAt)}</p>
                      <Badge variant={isRead ? "secondary" : "default"} className="mt-1">
                        {isRead ? "Leído" : "Nuevo"}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-3 text-sm whitespace-pre-line">{message.message}</p>
                  <div className="mt-4 flex justify-end gap-2">
                    {!isRead ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={markReadMutation.isPending}
                        onClick={() => markReadMutation.mutate({ id: message.id })}
                      >
                        Marcar como leído
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (!window.confirm("¿Eliminar este mensaje?")) return;
                        deleteMutation.mutate({ id: message.id });
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
