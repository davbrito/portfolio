import { createRouter, Link } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";
import { QueryClient } from "@tanstack/react-query";

// Create a new router instance
export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: { queryClient },
    defaultNotFoundComponent: () => {
      return (
        <div>
          <p>Not found!</p>
          <Link to="/">Go home</Link>
        </div>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};
