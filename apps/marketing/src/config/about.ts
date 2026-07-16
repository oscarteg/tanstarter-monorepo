/**
 * About page content.
 *
 * The long-form prose lives in `src/content/pages/about.mdx`; the structured
 * bits (team roster, closing CTA) live here.
 */

import type { Cta, Person } from "./shared";

export type AboutConfig = {
  team: {
    headline: string;
    subheadline: string;
    members: Person[];
  };
  cta: {
    headline: string;
    subheadline: string;
    primaryCta: Cta;
    secondaryCta: Cta;
  };
};

export const about: AboutConfig = {
  team: {
    headline: "Our leadership team",
    subheadline:
      "Oatmeals's leadership team combines decades of experience in private equity, where they honed their skills in cost-cutting and maximizing shareholder value.",
    members: [
      {
        avatar: "https://assets.tailwindplus.com/avatars/1.webp?w=800&h=1000",
        name: "Leslie Alexander",
        byline: "Co-Founder / CEO",
      },
      {
        avatar: "https://assets.tailwindplus.com/avatars/2.webp?w=800&h=1000",
        name: "Michael Foster",
        byline: "Co-Founder / CTO",
      },
      {
        avatar: "https://assets.tailwindplus.com/avatars/7.webp?w=800&h=1000",
        name: "Dries Vincent",
        byline: "Business Relations",
      },
      {
        avatar: "https://assets.tailwindplus.com/avatars/4.webp?w=800&h=1000",
        name: "Lindsay Walton",
        byline: "Front-end Developer",
      },
      {
        avatar: "https://assets.tailwindplus.com/avatars/5.webp?w=800&h=1000",
        name: "Noor Hasan",
        byline: "Designer",
      },
      {
        avatar: "https://assets.tailwindplus.com/avatars/6.webp?w=800&h=1000",
        name: "Tom Cook",
        byline: "Director of Product",
      },
      {
        avatar: "https://assets.tailwindplus.com/avatars/8.webp?w=800&h=1000",
        name: "Whitney Francis",
        byline: "Copywriter",
      },
      {
        avatar: "https://assets.tailwindplus.com/avatars/3.webp?w=800&h=1000",
        name: "Leonard Wu",
        byline: "Senior Designer",
      },
    ],
  },

  cta: {
    headline: "Have anymore questions?",
    subheadline:
      "Chat to someone on our sales team, who will make promises about our roadmap that we won't keep.",
    primaryCta: { label: "Chat with us", href: "#" },
    secondaryCta: { label: "Book a demo", href: "#" },
  },
};

/** Reused by `/pricing`, which closes with the same CTA. */
export const contactCta = about.cta;
