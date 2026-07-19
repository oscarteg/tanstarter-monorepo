import type { LinkProps } from "@tanstack/react-router";

import type { NavigationConfig } from "#/config/navigation";
import type { ModuleNavItem } from "#/modules/types";

export type CommandEntry = { label: string; url: LinkProps["to"] };
export type CommandGroupData = { heading: string; entries: CommandEntry[] };

/**
 * Flatten the sidebar navigation into command-palette groups: one group per
 * primary nav item (its sub-links, or the item itself when it has none), plus a
 * "Modules" group for every enabled feature module. The palette derives
 * entirely from the same config the sidebar uses, so there is a single source
 * of truth for what's navigable.
 */
export function buildCommandGroups(
  navigation: NavigationConfig,
  moduleNav: ModuleNavItem[] = [],
): CommandGroupData[] {
  const navGroups: CommandGroupData[] = navigation.navMain.map((item) => ({
    heading: item.title,
    entries: (item.items ?? [{ title: item.title, url: item.url }]).map((sub) => ({
      label: sub.title,
      url: sub.url,
    })),
  }));

  if (moduleNav.length === 0) return navGroups;

  return [
    ...navGroups,
    {
      heading: "Modules",
      // Module packages can't import the app's route tree, so their urls are
      // plain strings — narrowed here at the one boundary where they meet it.
      entries: moduleNav.map((item) => ({
        label: item.title,
        url: item.url as LinkProps["to"],
      })),
    },
  ];
}
