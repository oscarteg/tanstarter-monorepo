import { type AnyRoute, createRoute } from "@tanstack/react-router";

import { NotesScreen } from "./ui/notes-screen";

/**
 * The notes module's routes, mounted under the authed `/app` shell. The parent
 * route is supplied by the app when it assembles the tree (see the registry).
 */
export function notesRoutes(parent: AnyRoute) {
  return [
    createRoute({
      getParentRoute: () => parent,
      path: "notes",
      component: NotesScreen,
    }),
  ];
}
