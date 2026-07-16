import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

/**
 * Long-form pages authored as MDX.
 *
 * Frontmatter carries the headings and SEO metadata; the MDX body is the prose,
 * rendered through the `Document` element so it picks up the typographic styles
 * without any per-page markup.
 *
 * The schema uses the `zod` instance bundled with Astro (`astro/zod`) rather
 * than the workspace's valibot: Astro's collection loader validates frontmatter
 * with zod and accepts nothing else. It adds no dependency of its own.
 */
const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.mdx" }),
  schema: z.object({
    /** Rendered as the page's single `<h1>`. */
    title: z.string(),
    /** Meta description and OpenGraph description for this page. */
    description: z.string(),
    /** Optional lead paragraph under the title. */
    subheadline: z.string().optional(),
    /** Present on pages that open with a hero photo instead of prose. */
    photo: z
      .object({
        src: z.string(),
        alt: z.string(),
        width: z.number(),
        height: z.number(),
      })
      .optional(),
    /** Heading for the prose section, when the body needs one of its own. */
    proseHeadline: z.string().optional(),
  }),
});

export const collections = { pages };
