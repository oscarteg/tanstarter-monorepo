import type { NavigationConfig } from "#/config/navigation";

export type CommandEntry = { label: string; url: string };
export type CommandGroupData = { heading: string; entries: CommandEntry[] };

/**
 * Flatten the sidebar navigation config into command-palette groups: one group
 * per primary nav item (its sub-links, or the item itself when it has none),
 * plus a "Projects" group. The palette derives entirely from `config/navigation`
 * so there's a single source of truth for what's navigable.
 */
export function buildCommandGroups(navigation: NavigationConfig): CommandGroupData[] {
  const navGroups: CommandGroupData[] = navigation.navMain.map((item) => ({
    heading: item.title,
    entries: (item.items ?? [{ title: item.title, url: item.url }]).map((sub) => ({
      label: sub.title,
      url: sub.url,
    })),
  }));

  const projects: CommandGroupData = {
    heading: "Projects",
    entries: navigation.projects.map((project) => ({ label: project.name, url: project.url })),
  };

  return [...navGroups, projects];
}
