import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { GeneralError } from "./features/errors/general-error";
import { NotFoundError } from "./features/errors/not-found-error";

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,

    context: {
      queryClient,
      auth: {
        session: null,
        isAuthenticated: false,
        isAdmin: false,
      },
    },

    defaultNotFoundComponent: NotFoundError,
    defaultErrorComponent: GeneralError,

    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
