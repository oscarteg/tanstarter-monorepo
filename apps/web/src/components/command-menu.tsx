import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@repo/ui/components/command";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, useEffect } from "react";

import { navigation } from "#/config/navigation";
import { buildCommandGroups } from "#/lib/command-items";
import { useUiStore } from "#/stores/ui-store";

/**
 * ⌘K command palette. Opens on ⌘K / Ctrl+K or via the app-shell search field
 * (both drive `ui-store.commandOpen`). Entries come from `config/navigation`
 * (see `buildCommandGroups`), so changing the sidebar changes the palette too.
 */
export function CommandMenu() {
  const open = useUiStore((state) => state.commandOpen);
  const setOpen = useUiStore((state) => state.setCommandOpen);
  const toggle = useUiStore((state) => state.toggleCommand);
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  const go = (url: string) => {
    setOpen(false);
    if (url === "#") return;
    // Config-driven paths aren't part of the typed route tree; navigate by string.
    navigate({ to: url as "/" });
  };

  const groups = buildCommandGroups(navigation);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map((group, index) => (
          <Fragment key={group.heading}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={group.heading}>
              {group.entries.map((entry) => (
                <CommandItem key={`${group.heading}:${entry.label}`} onSelect={() => go(entry.url)}>
                  {entry.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
