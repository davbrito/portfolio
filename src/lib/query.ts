import { QueryClient, QueryClientProvider, useQuery, type QueryClientProviderProps } from "@tanstack/react-query";
import type z from "astro/zod";
import type { ActionAccept, ActionClient } from "astro:actions";
import { cache, createElement, useState } from "react";

interface ActionKey<TOutput, TAccept extends ActionAccept | undefined, TInputSchema extends z.ZodType | undefined> {
  action: ActionClient<TOutput, TAccept, TInputSchema> & string;
  data?: TAccept extends "form" ? FormData : TInputSchema extends z.ZodType ? z.input<TInputSchema> : never;
}

export function useActionQuery<
  TOutput,
  TAccept extends ActionAccept | undefined,
  TInputSchema extends z.ZodType | undefined,
>(key: ActionKey<TOutput, TAccept, TInputSchema>) {
  return useQuery({
    queryKey: [key.action.toString(), key.data],
    queryFn: () => key.action.orThrow(key.data!),
  });
}

export function actionFetcher<
  TOutput,
  TAccept extends ActionAccept | undefined,
  TInputSchema extends z.ZodType | undefined,
>(key: ActionKey<TOutput, TAccept, TInputSchema>) {
  return key.action.orThrow(key.data!);
}

const getQueryClient = cache(() => new QueryClient());

export function QueryProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());
  return createElement<QueryClientProviderProps>(QueryClientProvider, { client: queryClient }, props.children);
}
