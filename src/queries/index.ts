import {
  deleteMessageAction,
  getProfileAction,
  listMessagesAction,
  markReadMessageAction,
  upsertProfileAction,
} from "#/actions/index.ts";
import type { ProfilePayloadInput } from "#/lib/validators/profile.ts";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export const profileQueryKey = ["profile.get"] as const;
export const messagesListQueryKey = ["messages.list"] as const;

export function profileOptions() {
  return queryOptions({
    queryKey: profileQueryKey,
    queryFn: ({ signal }) => getProfileAction({ signal }),
  });
}

export function messageListOptions(filter: "all" | "read" | "unread") {
  return queryOptions({
    queryKey: [...messagesListQueryKey, { filter }],
    queryFn: ({ signal }) => listMessagesAction({ signal, data: { filter } }),
  });
}

export function messagesMarkReadMutationOptions() {
  return mutationOptions({
    mutationKey: ["messages.markRead"],
    mutationFn: ({ id }: { id: string }) => markReadMessageAction({ data: { id } }),
  });
}

export function messagesDeleteMutationOptions() {
  return mutationOptions({
    mutationKey: ["messages.delete"],
    mutationFn: ({ id }: { id: string }) => deleteMessageAction({ data: { id } }),
  });
}

export function profileUpsertMutationOptions() {
  return mutationOptions({
    mutationKey: ["profile.upsert"],
    mutationFn: (input: ProfilePayloadInput) => upsertProfileAction({ data: input }),
  });
}
