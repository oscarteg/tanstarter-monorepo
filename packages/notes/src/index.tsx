import type { AnyRoute } from "@tanstack/react-router";
import { NotebookPenIcon } from "lucide-react";

import { notesRoutes } from "./routes";

/**
 * The notes module — a self-contained feature: routes, UI, and data access in
 * one package, reached through a single entry point. Register it in the app's
 * module registry to enable it; set `enabled: false` (or remove it) to strip its
 * routes and its sidebar nav.
 */
export const notesModule = {
  id: "notes",
  title: "Notes",
  enabled: true,
  nav: [{ title: "Notes", url: "/app/notes", icon: NotebookPenIcon }],
  routes: (parent: AnyRoute) => notesRoutes(parent),
};
