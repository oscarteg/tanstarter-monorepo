/**
 * Pricing content, shared by the home page pricing section and `/pricing`.
 *
 * `tiers` drives the plan cards; `comparison` drives the feature table on
 * `/pricing`. Tier names are the join key between the two, so keep them in sync.
 */

export type BillingPeriod = "Monthly" | "Yearly";

export type PlanCta = {
  label: string;
  href: string;
  /** `solid` is the emphasised plan; `soft` is everything else. */
  variant: "solid" | "soft";
};

export type PricingTier = {
  name: string;
  /** Price per billing period, pre-formatted so currency stays your call. */
  price: Record<BillingPeriod, string>;
  blurb: string;
  features: string[];
  badge?: string;
  cta: PlanCta;
};

/** `true` renders a checkmark, `false` a dash, a string renders verbatim. */
export type ComparisonValue = boolean | string;

export type ComparisonRow = {
  name: string;
  /** A bare value applies to every tier; a record varies it per tier. */
  value: ComparisonValue | Record<string, ComparisonValue>;
};

export type ComparisonGroup = {
  title: string;
  features: ComparisonRow[];
};

export type PricingConfig = {
  /** Labels for the billing toggle, in display order. */
  periods: readonly BillingPeriod[];
  /** Suffix shown next to the price, per period. */
  periodSuffix: Record<BillingPeriod, string>;
  /** Shorter suffix used by the home page cards. */
  compactPeriodSuffix: Record<BillingPeriod, string>;
  tiers: PricingTier[];
  comparison: ComparisonGroup[];
};

export const pricing: PricingConfig = {
  periods: ["Monthly", "Yearly"],
  periodSuffix: { Monthly: "/month", Yearly: "/year" },
  compactPeriodSuffix: { Monthly: "/mo", Yearly: "/yr" },

  tiers: [
    {
      name: "Starter",
      price: { Monthly: "$12", Yearly: "$120" },
      blurb: "Small teams getting started with shared inboxes",
      features: [
        "Shared inbox for up to 2 mailboxes",
        "Tagging & assignment",
        "Private notes",
        "Automatic replies",
        "Email support",
      ],
      cta: { label: "Start free trial", href: "#", variant: "soft" },
    },
    {
      name: "Growth",
      price: { Monthly: "$49", Yearly: "$490" },
      blurb: "Growing teams needing collaboration and insights",
      badge: "Most popular",
      features: [
        "Everything in Starter",
        "Inbox Agent",
        "Unlimited mailboxes",
        "Collision detection",
        "Snippets and templates",
        "Reporting dashboard",
        "Slack integration",
      ],
      cta: { label: "Start free trial", href: "#", variant: "solid" },
    },
    {
      name: "Pro",
      price: { Monthly: "$299", Yearly: "$2990" },
      blurb: "Support-focused organizations and larger teams",
      features: [
        "Everything in Growth",
        "Custom roles & permissions",
        "Automation engine",
        "API access",
        "SLA tracking",
        "SSO support",
        "SOC 2 compliance",
      ],
      cta: { label: "Start free trial", href: "#", variant: "soft" },
    },
  ],

  comparison: [
    {
      title: "Collaboration",
      features: [
        { name: "Shared inboxes", value: { Starter: "2", Growth: "Unlimited", Pro: "Unlimited" } },
        { name: "Private notes", value: true },
        { name: "Tagging & assignment", value: true },
        { name: "Collision detection", value: { Starter: false, Growth: true, Pro: true } },
        {
          name: "Real-time activity indicators",
          value: { Starter: false, Growth: true, Pro: true },
        },
        { name: "Internal chat", value: { Starter: false, Growth: true, Pro: true } },
      ],
    },
    {
      title: "Automation",
      features: [
        { name: "Automatic replies", value: true },
        { name: "Inbox Agent", value: { Starter: false, Growth: true, Pro: true } },
        { name: "Automation engine", value: { Starter: false, Growth: true, Pro: true } },
        { name: "Snippets and templates", value: { Starter: false, Growth: true, Pro: true } },
        { name: "SLA tracking", value: { Starter: false, Growth: false, Pro: true } },
      ],
    },
    {
      title: "Team Management",
      features: [
        { name: "Unlimited users", value: { Starter: "Up to 5", Growth: true, Pro: true } },
        { name: "Reporting dashboard", value: { Starter: false, Growth: true, Pro: true } },
        { name: "Slack integration", value: { Starter: false, Growth: true, Pro: true } },
        { name: "Roles & permissions", value: { Starter: false, Growth: false, Pro: true } },
        { name: "SSO support", value: { Starter: false, Growth: false, Pro: true } },
      ],
    },
    {
      title: "Support",
      features: [
        { name: "Email support", value: true },
        { name: "Priority response", value: { Starter: false, Growth: true, Pro: true } },
        { name: "Dedicated manager", value: { Starter: false, Growth: false, Pro: true } },
      ],
    },
  ],
};

/** Page-level copy for `/pricing`, kept next to the data it introduces. */
export const pricingPage = {
  headline: "Pricing",
  subheadline:
    "Simplify your shared inbox, collaborate effortlessly, and give every customer a reply that feels personal, even if it was written by a bot.",
  seo: {
    title: "Pricing",
    description:
      "Simple pricing for teams of every size. Start free, upgrade when your inbox does.",
  },
} as const;
