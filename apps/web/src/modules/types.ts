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
 * A feature module: a self-contained package that owns its UI, data access, and
 * server functions, exposed through a single entry point.
 *
 * Routing stays with the app: each module is mounted by a thin route file under
 * `routes/_auth/app/` so its route remains part of TanStack Start's generated,
 * type-safe route tree. (Assembling the tree by hand instead produces an invalid
 * tree at runtime — `createRouter` throws on malformed segments.)
 *
 * `enabled` is the single on/off switch: the registry filters disabled modules
 * out of the sidebar nav, and each mount file guards on it, so a disabled module
 * contributes neither nav nor a reachable route.
 */
export type AppModule = {
  /** Stable key, e.g. "notes". */
  id: string;
  title: string;
  /** The on/off switch. */
  enabled: boolean;
  /** Sidebar entries contributed by this module. */
  nav?: ModuleNavItem[];
};

/** Identity helper for authoring a module with inference + a single call site. */
export function defineModule(module: AppModule): AppModule {
  return module;
}
