import { notesModule, NotesScreen } from "@repo/notes";
import { createFileRoute, notFound } from "@tanstack/react-router";

/**
 * Mount point for the notes module.
 *
 * Modules own their UI and data access; the app owns routing. A module is
 * mounted by a thin file like this one so the route stays part of TanStack
 * Start's generated (type-safe) route tree. The `enabled` flag on the module is
 * the on/off switch: disabled modules 404 here and drop out of the sidebar nav
 * via the registry.
 */
export const Route = createFileRoute("/_auth/app/notes")({
  beforeLoad: () => {
    if (!notesModule.enabled) {
      throw notFound();
    }
  },
  component: NotesScreen,
});
