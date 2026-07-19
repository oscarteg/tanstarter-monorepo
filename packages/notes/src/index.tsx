import { NotebookPenIcon } from "lucide-react";

export { NotesScreen } from "./ui/notes-screen";

/**
 * The notes module — a self-contained feature (UI, data access, server
 * functions) reached through a single entry point. It is mounted by a thin
 * route file at `apps/web/src/routes/_auth/app/notes.tsx`, which guards on
 * `enabled`. Flip `enabled` to false (or remove the registry entry + mount
 * file) to switch the module off — its route 404s and its sidebar nav
 * disappears.
 */
export const notesModule = {
  id: "notes",
  title: "Notes",
  enabled: true,
  nav: [{ title: "Notes", url: "/app/notes", icon: NotebookPenIcon }],
};
