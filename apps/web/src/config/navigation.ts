import type { LinkProps } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { LayoutDashboardIcon, SettingsIcon } from "lucide-react";

/**
 * Navigation configuration — the single source of truth for the app shell.
 *
 * Edit this file to change the sidebar. Everything here points at a route that
 * actually exists; add your own entries as you add routes. Feature modules
 * contribute their own nav separately via the module registry
 * (`src/modules/registry.ts`), so they don't need an entry here.
 *
 * Deliberately minimal: a template that ships a wall of placeholder links is
 * something every project has to delete before it can start.
 */

/**
 * Routes are typed against the generated route tree, so a link to a route that
 * doesn't exist fails to compile rather than 404ing at runtime.
 */
type AppRoute = LinkProps["to"];

export type NavSubItem = {
  title: string;
  url: AppRoute;
};

export type NavItem = {
  title: string;
  url: AppRoute;
  icon: LucideIcon;
  /** When present, the item renders as a collapsible group of sub-links. */
  items?: NavSubItem[];
};

export type NavigationConfig = {
  /** Shown in the sidebar header. */
  appName: string;
  logo: LucideIcon;
  navMain: NavItem[];
};

export const navigation: NavigationConfig = {
  appName: "Acme Inc",
  logo: LayoutDashboardIcon,
  navMain: [
    { title: "Dashboard", url: "/app", icon: LayoutDashboardIcon },
    { title: "Settings", url: "/app/settings", icon: SettingsIcon },
  ],
};
