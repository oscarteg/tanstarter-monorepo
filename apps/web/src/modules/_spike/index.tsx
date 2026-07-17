import { createRoute } from "@tanstack/react-router";
import { LayersIcon } from "lucide-react";

import { defineModule } from "../types";

/** Throwaway screen to prove a module-provided route renders under /app. */
function SpikeScreen() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Module spike</h1>
      <p className="text-muted-foreground">
        This screen is rendered by a module's route object, injected under /app by the registry.
      </p>
    </div>
  );
}

export const spikeModule = defineModule({
  id: "spike",
  title: "Spike",
  enabled: true,
  nav: [{ title: "Spike", url: "/app/spike", icon: LayersIcon }],
  routes: (parent) => [
    createRoute({
      getParentRoute: () => parent,
      path: "spike",
      component: SpikeScreen,
    }),
  ],
});
