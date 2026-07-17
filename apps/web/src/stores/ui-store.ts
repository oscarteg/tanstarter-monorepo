import { create } from "zustand";

/**
 * UI state store — ephemeral client state that doesn't belong on the server.
 *
 * Convention for `src/stores/`: one store per slice, typed, and subscribed via
 * selectors (`useUiStore((s) => s.commandOpen)`) so a component only re-renders
 * when the slice it reads changes. Keep server data in TanStack Query — this is
 * for local UI state only.
 */
export type UiState = {
  /** Whether the ⌘K command palette is open (consumed by the palette dialog). */
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  toggleCommand: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  commandOpen: false,
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  toggleCommand: () => set((state) => ({ commandOpen: !state.commandOpen })),
}));
