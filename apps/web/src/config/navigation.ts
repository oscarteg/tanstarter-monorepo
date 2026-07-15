import type { LucideIcon } from "lucide-react";
import {
  AudioWaveformIcon,
  BookOpenIcon,
  BotIcon,
  CommandIcon,
  FrameIcon,
  GalleryVerticalEndIcon,
  MapIcon,
  PieChartIcon,
  Settings2Icon,
  SquareTerminalIcon,
} from "lucide-react";

/**
 * Navigation configuration — the single source of truth for the app shell.
 *
 * Edit this file to change the sidebar: the team switcher, the grouped
 * primary navigation (with collapsible sub-links), and the Projects list all
 * read from here. Nothing about the layout needs to be touched to re-theme
 * the shell for a new project.
 *
 * `url`s are plain hrefs so the template compiles before real routes exist.
 * Once a route exists, swap the `<a href>` in `app-sidebar.tsx` for a typed
 * TanStack Router `<Link to>`.
 */

export type NavSubItem = {
  title: string;
  url: string;
};

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  /** When present, the item renders as a collapsible group of sub-links. */
  items?: NavSubItem[];
};

export type ProjectItem = {
  name: string;
  url: string;
  icon: LucideIcon;
};

export type TeamItem = {
  name: string;
  logo: LucideIcon;
  plan: string;
};

export type NavigationConfig = {
  teams: TeamItem[];
  navMain: NavItem[];
  projects: ProjectItem[];
};

export const navigation: NavigationConfig = {
  teams: [
    { name: "Acme Inc", logo: GalleryVerticalEndIcon, plan: "Enterprise" },
    { name: "Acme Corp.", logo: AudioWaveformIcon, plan: "Startup" },
    { name: "Evil Corp.", logo: CommandIcon, plan: "Free" },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminalIcon,
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: BotIcon,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpenIcon,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2Icon,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
      ],
    },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: FrameIcon },
    { name: "Sales & Marketing", url: "#", icon: PieChartIcon },
    { name: "Travel", url: "#", icon: MapIcon },
  ],
};
