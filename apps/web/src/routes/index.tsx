import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * The template has no public landing page: "/" routes you where you belong —
 * into the app when signed in, or to the login screen when not. Point the
 * signed-in destination at whatever should be the app's home ("inbox").
 */
export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData({
      ...authQueryOptions(),
      revalidateIfStale: true,
    });

    throw redirect({ to: user ? "/app" : "/login" });
  },
});
