import {
  QueryClient,
  QueryClientProvider,
  type QueryClientProviderProps,
} from "@tanstack/react-query";
import { cache, createElement, useState } from "react";

const getQueryClient = cache(() => new QueryClient());

export function QueryProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());
  return createElement<QueryClientProviderProps>(
    QueryClientProvider,
    { client: queryClient },
    props.children,
  );
}
