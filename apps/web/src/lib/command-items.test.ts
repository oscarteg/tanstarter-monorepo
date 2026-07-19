import { BotIcon } from "lucide-react";
import { describe, expect, it } from "vite-plus/test";

import type { NavigationConfig } from "#/config/navigation";
import type { ModuleNavItem } from "#/modules/types";

import { buildCommandGroups } from "./command-items";

const navigation: NavigationConfig = {
  appName: "Test App",
  logo: BotIcon,
  navMain: [
    {
      title: "Settings",
      url: "/app/settings",
      icon: BotIcon,
      items: [{ title: "Profile", url: "/app/settings" }],
    },
    { title: "Dashboard", url: "/app", icon: BotIcon },
  ],
};

const moduleNav: ModuleNavItem[] = [{ title: "Notes", url: "/app/notes", icon: BotIcon }];

describe("buildCommandGroups", () => {
  it("uses sub-items when a nav item has them", () => {
    const [first] = buildCommandGroups(navigation);
    expect(first).toEqual({
      heading: "Settings",
      entries: [{ label: "Profile", url: "/app/settings" }],
    });
  });

  it("falls back to the item itself when there are no sub-items", () => {
    const groups = buildCommandGroups(navigation);
    expect(groups[1]).toEqual({
      heading: "Dashboard",
      entries: [{ label: "Dashboard", url: "/app" }],
    });
  });

  it("appends enabled module nav as a Modules group", () => {
    const groups = buildCommandGroups(navigation, moduleNav);
    expect(groups.at(-1)).toEqual({
      heading: "Modules",
      entries: [{ label: "Notes", url: "/app/notes" }],
    });
  });

  it("omits the Modules group when no modules are enabled", () => {
    const groups = buildCommandGroups(navigation, []);
    expect(groups.some((group) => group.heading === "Modules")).toBe(false);
  });
});
