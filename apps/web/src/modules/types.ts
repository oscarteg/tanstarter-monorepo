import type { AnyRoute } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

/**
 * A navigation entry a module contributes to the sidebar. Mirrors the shape in
 * `#/config/navigation` so module nav can be merged into the shell.
 */
export type ModuleNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

/**
 * A feature module: a self-contained unit that owns its routes, UI, and data
 * access, and can be toggled on/off from the registry. A module package's
 * single entry point exports one `AppModule`.
 */
export type AppModule = {
  /** Stable key, e.g. "notes". */
  id: string;
  title: string;
  /** The on/off switch — disabled modules contribute neither routes nor nav. */
  enabled: boolean;
  /** Sidebar entries contributed by this module. */
  nav?: ModuleNavItem[];
  /**
   * Route factory. Given the authed app-shell parent route, returns the
   * module's routes to mount beneath it (path is relative to `/app`).
   */
  routes: (parent: AnyRoute) => AnyRoute[];
};

/** Identity helper for authoring a module with inference + a single call site. */
export function defineModule(module: AppModule): AppModule {
  return module;
}
