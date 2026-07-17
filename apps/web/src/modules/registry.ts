import type { AppModule } from "./types";
import { spikeModule } from "./_spike";

/**
 * The module registry — the single place that turns features on and off.
 * Add a module here to enable it; set `enabled: false` (or remove the entry)
 * to strip its routes AND its sidebar nav from the app.
 */
export const modules: AppModule[] = [spikeModule];

export const enabledModules = modules.filter((module) => module.enabled);
