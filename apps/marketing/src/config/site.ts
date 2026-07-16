/**
 * Brand, navigation and SEO defaults.
 *
 * This file, its siblings in `src/config`, and the MDX in `src/content` are the
 * only places you should need to edit to re-theme this site for a new project.
 * Components read from here — never hardcode copy into markup.
 */

export type NavLink = {
  label: string;
  href: string;
};

export type FooterCategory = {
  title: string;
  links: NavLink[];
};

/** Keys map to the icons wired up in `src/components/sections/Footer.astro`. */
export type SocialPlatform = "x" | "github" | "youtube";

export type SocialLink = {
  platform: SocialPlatform;
  /** Accessible name for the icon-only link. */
  name: string;
  href: string;
};

export type Logo = {
  /** Source used in light mode. */
  light: string;
  /** Source used in dark mode. */
  dark: string;
  alt: string;
  width: number;
  height: number;
};

export type SiteConfig = {
  name: string;
  logo: Logo;
  nav: NavLink[];
  actions: { secondary: NavLink; primary: NavLink };
  notFound: { title: string; headline: string; subheadline: string; cta: NavLink };
  footer: { categories: FooterCategory[]; fineprint: string };
  newsletter: { headline: string; subheadline: string; action: string };
  social: SocialLink[];
  seo: {
    /** `%s` is replaced with the per-page title. */
    titleTemplate: string;
    defaultTitle: string;
    defaultDescription: string;
    /** Absolute URL or site-relative path. 1200x630. */
    defaultImage: string;
    twitterHandle: string;
    locale: string;
  };
};

export const site: SiteConfig = {
  name: "Oatmeal",

  logo: {
    light: "https://assets.tailwindplus.com/logos/oatmeal-instrument.svg?color=olive-950",
    dark: "https://assets.tailwindplus.com/logos/oatmeal-instrument.svg?color=white",
    alt: "Oatmeal",
    width: 85,
    height: 28,
  },

  nav: [
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Docs", href: "#" },
  ],

  actions: {
    secondary: { label: "Log in", href: "#" },
    primary: { label: "Get started", href: "#" },
  },

  notFound: {
    title: "Page not found",
    headline: "Page not found",
    subheadline: "Sorry, but the page you were looking for could not be found.",
    cta: { label: "Go back home", href: "/" },
  },

  footer: {
    categories: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "/#features" },
          { label: "Pricing", href: "/pricing" },
          { label: "Integrations", href: "#" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Careers", href: "#" },
          { label: "Blog", href: "#" },
          { label: "Press Kit", href: "#" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Help Center", href: "#" },
          { label: "API Docs", href: "#" },
          { label: "Status", href: "#" },
          { label: "Contact", href: "#" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "#" },
          { label: "Security", href: "#" },
        ],
      },
    ],
    fineprint: "© 2025 Oatmeal, Inc.",
  },

  newsletter: {
    headline: "Stay in the loop",
    subheadline:
      "Get customer support tips, product updates and customer stories that you can archive as soon as they arrive.",
    action: "#",
  },

  social: [
    { platform: "x", name: "X", href: "https://x.com" },
    { platform: "github", name: "GitHub", href: "https://github.com" },
    { platform: "youtube", name: "YouTube", href: "https://www.youtube.com" },
  ],

  seo: {
    titleTemplate: "%s — Oatmeal",
    defaultTitle: "Oatmeal — Customer support that feels like a conversation",
    defaultDescription:
      "Simplify your shared inbox, collaborate effortlessly, and give every customer a reply that feels personal.",
    defaultImage: "/og.png",
    twitterHandle: "@oatmeal",
    locale: "en_US",
  },
};
