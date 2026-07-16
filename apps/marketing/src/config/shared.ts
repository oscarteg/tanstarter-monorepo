/**
 * Content shapes reused across pages, plus the one stats block that the home
 * and about pages both render.
 */

export type Cta = {
  label: string;
  href: string;
};

/** Remote images are rendered as plain `<img>`, so sizes are required. */
export type Image = {
  src: string;
  /** Empty for decorative images — they sit next to text that names them. */
  alt: string;
  width: number;
  height: number;
};

/** Wallpaper tints available to `Screenshot`. */
export type Wallpaper = "green" | "blue" | "purple" | "brown";

export type Placement =
  | "bottom"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "top-left"
  | "top-right";

export type Stat = {
  stat: string;
  text: string;
};

export type Testimonial = {
  quote: string;
  avatar: string;
  name: string;
  byline: string;
};

export type Person = {
  avatar: string;
  name: string;
  byline: string;
};

export type Faq = {
  /** Stable id — used to wire the button to its disclosure panel. */
  id: string;
  question: string;
  answer: string;
};

export type StatsSection = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  items: Stat[];
};

/** Rendered identically on the home and about pages. */
export const statsSection: StatsSection = {
  eyebrow: "Built for scale",
  headline: "The inbox powering customer conversations everywhere.",
  subheadline:
    "Oatmeal helps teams deliver personal, organized, and fast customer support across the world. From small startups to enterprise teams, we process millions of messages each month — using a massive network of low wage workers stationed around the globe.",
  items: [
    { stat: "2M+", text: "Emails manually processed every week across thousands of teams." },
    { stat: "99.98%", text: "Uptime — because your customers never stop complaining." },
  ],
};

/** Shown on both `/about` and `/pricing`. */
export const featuredTestimonial: Testimonial = {
  quote:
    "Ever since we started using Oatmeal, our customer satisfaction scores have skyrocketed. The personal touch that their human-AI hybrid support provides is unparalleled.",
  avatar: "https://assets.tailwindplus.com/avatars/16.webp?w=1400&h=1000",
  name: "Lynn Marshall",
  byline: "Founder at Pine Labs",
};

/** Shown above the accordion on both the home and pricing pages. */
export const faqsHeadline = "Questions & Answers";

export const faqs: Faq[] = [
  {
    id: "faq-1",
    question: "Do I need a credit card to start the free trial?",
    answer:
      "Yes, but don't worry, you won't be charged until the trial period is over. We won't send you an email reminding you when this happens because we are really hoping you'll forget and we can keep charging you until your cards expires",
  },
  {
    id: "faq-2",
    question: "Can my whole team use the same inbox?",
    answer:
      "Yes, the more the merrier! Oatmeal works best when your entire company has access. We will charge you per additional seat, but we won't tell you about this until you get your invoice.",
  },
  {
    id: "faq-3",
    question: "Is the AI agent actually a bunch of people in India?",
    answer:
      "Not just India! We have people in lots of countries around the world pretending to be an AI, including some that are currently under sanctions, so we can't legally mention them here.",
  },
  {
    id: "faq-4",
    question: "Does Oatmeal replace my email client?",
    answer:
      "Absolutely. The idea is that we transition you away from email entirely, so you become completely dependent on our service. Like a parasite living off a host.",
  },
];

/** Client logos in the home hero and pricing hero footers. */
export const logos = [
  { src: "https://assets.tailwindplus.com/logos/9.svg", width: 51, height: 32 },
  { src: "https://assets.tailwindplus.com/logos/10.svg", width: 70, height: 32 },
  { src: "https://assets.tailwindplus.com/logos/11.svg", width: 100, height: 32 },
  { src: "https://assets.tailwindplus.com/logos/12.svg", width: 85, height: 32 },
  { src: "https://assets.tailwindplus.com/logos/13.svg", width: 75, height: 32 },
  { src: "https://assets.tailwindplus.com/logos/8.svg", width: 85, height: 32 },
];
