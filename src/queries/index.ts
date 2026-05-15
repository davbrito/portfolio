import { actions } from "#/actions/index.ts";
import { queryOptions } from "@tanstack/react-query";

export function messageListOptions(filter: "all" | "read" | "unread") {
  return queryOptions({
    queryKey: ["messages.list", { filter }],
    queryFn: ({ signal }) => actions.messages.list({ signal, data: { filter } }),
  });
}
