import { BotIcon } from "lucide-react";
import { describe, expect, it } from "vite-plus/test";

import type { NavigationConfig } from "#/config/navigation";

import { buildCommandGroups } from "./command-items";

const navigation: NavigationConfig = {
  teams: [],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: BotIcon,
      items: [{ title: "History", url: "/history" }],
    },
    { title: "Models", url: "/models", icon: BotIcon },
  ],
  projects: [{ name: "Design", url: "/design", icon: BotIcon }],
};

describe("buildCommandGroups", () => {
  it("uses sub-items when a nav item has them", () => {
    const [first] = buildCommandGroups(navigation);
    expect(first).toEqual({
      heading: "Playground",
      entries: [{ label: "History", url: "/history" }],
    });
  });

  it("falls back to the item itself when there are no sub-items", () => {
    const groups = buildCommandGroups(navigation);
    expect(groups[1]).toEqual({
      heading: "Models",
      entries: [{ label: "Models", url: "/models" }],
    });
  });

  it("appends a Projects group last", () => {
    const groups = buildCommandGroups(navigation);
    expect(groups.at(-1)).toEqual({
      heading: "Projects",
      entries: [{ label: "Design", url: "/design" }],
    });
  });
});
