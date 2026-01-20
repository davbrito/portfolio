import { QueryClient, QueryClientProvider, useQuery, type QueryClientProviderProps } from "@tanstack/react-query";
import type { ActionClient } from "astro:actions";
import { cache, createElement, useState } from "react";

export function useActionQuery<TAction extends ActionClient<any, any, any>>(
  action: TAction,
  data?: Parameters<NoInfer<TAction>>[0],
) {
  return useQuery({
    queryKey: [action.toString(), data],
    queryFn: (): Promise<Awaited<ReturnType<TAction["orThrow"]>>> => action.orThrow(data!),
  });
}

const getQueryClient = cache(() => new QueryClient());

export function QueryProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());
  return createElement<QueryClientProviderProps>(QueryClientProvider, { client: queryClient }, props.children);
}
