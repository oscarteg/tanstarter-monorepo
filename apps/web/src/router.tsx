import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { DefaultCatchBoundary } from "#/components/default-catch-boundary";
import { DefaultNotFound } from "#/components/default-not-found";
import { enabledModules } from "#/modules/registry";

import { Route as rootRoute } from "./routes/__root";
// File-based routes stay the source of truth for each route's definition. The
// tree spine is assembled here so enabled modules can inject their routes under
// the /app shell (see modules/registry.ts). routeTree.gen.ts still provides the
// generated type registration; core routes keep their typed paths.
import { Route as appIndexRoute } from "./routes/_auth/app/index";
import { Route as appRoute } from "./routes/_auth/app/route";
import { Route as authRoute } from "./routes/_auth/route";
import { Route as loginRoute } from "./routes/_guest/login";
import { Route as guestRoute } from "./routes/_guest/route";
import { Route as signupRoute } from "./routes/_guest/signup";
import { Route as apiAuthRoute } from "./routes/api/auth/$";
import { Route as indexRoute } from "./routes/index";

function buildRouteTree() {
  const moduleRoutes = enabledModules.flatMap((module) => module.routes(appRoute));

  const appRouteWithChildren = appRoute.addChildren([appIndexRoute, ...moduleRoutes]);
  const authRouteWithChildren = authRoute.addChildren([appRouteWithChildren]);
  const guestRouteWithChildren = guestRoute.addChildren([loginRoute, signupRoute]);

  return rootRoute.addChildren([
    indexRoute,
    authRouteWithChildren,
    guestRouteWithChildren,
    apiAuthRoute,
  ]);
}

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 2, // 2 minutes
      },
    },
  });

  const router = createRouter({
    routeTree: buildRouteTree(),
    context: { queryClient, user: null },
    defaultPreload: "intent",
    // react-query will handle data fetching & caching
    // https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#passing-all-loader-events-to-an-external-cache
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: DefaultNotFound,
    scrollRestoration: true,
    defaultStructuralSharing: true,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    handleRedirects: true,
    wrapQueryClient: true,
  });

  return router;
}
