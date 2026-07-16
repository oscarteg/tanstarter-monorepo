# @repo/marketing

The static marketing site: a Tailwind Plus "Oatmeal" kit ported to Astro. It
builds to plain HTML with no server runtime, and ships `/`, `/about`,
`/pricing`, `/privacy` and a `404`.

```sh
vp run --filter=@repo/marketing dev      # local dev server
vp run --filter=@repo/marketing build    # static build into dist/
vp run --filter=@repo/marketing preview  # serve the built site
```

## Re-theming for a new project

Everything you need to change lives in `src/config/` and `src/content/`. You
should not have to touch component markup to launch a new brand.

| What                                            | Where                     |
| ----------------------------------------------- | ------------------------- |
| Brand name, logo, nav, footer links, socials    | `src/config/site.ts`      |
| Newsletter copy, fineprint, 404 copy            | `src/config/site.ts`      |
| SEO defaults: title template, description, OG   | `src/config/site.ts`      |
| Plans, prices, features, comparison table       | `src/config/pricing.ts`   |
| Home hero, features, testimonials, CTA          | `src/config/home.ts`      |
| Team roster, contact CTA                        | `src/config/about.ts`     |
| Stats, FAQs, client logos, featured testimonial | `src/config/shared.ts`    |
| About and privacy prose                         | `src/content/pages/*.mdx` |

Each config module is typed, so a missing or misspelled field is a build error
rather than a blank section.

The demo copy is deliberately absurd placeholder text about a fake SaaS. Replace
it — the types will tell you when you've covered everything.

### Before you launch

- **Add `public/og.png`** (1200x630). `site.seo.defaultImage` points at it and
  nothing ships one, so social previews 404 until you add it. Point
  `defaultImage` elsewhere if you'd rather.
- **Replace `public/favicon.svg`** — it's a neutral placeholder mark.
- **Set `site` in `astro.config.mjs`** and the `Sitemap:` line in
  `public/robots.txt` to your real origin.

### Colours and fonts

`src/styles/global.css` holds the Tailwind v4 `@theme`: the `olive-*` palette
and the `--font-display` / `--font-sans` tokens. Fonts are self-hosted via
Fontsource (`@fontsource/instrument-serif`, `@fontsource-variable/inter`) —
swap the imports and the two tokens to re-typeface the whole site.

### Editing prose

`/about` and `/privacy` render MDX from `src/content/pages/`. Frontmatter is
validated by the schema in `src/content.config.ts`:

- `title` becomes the page's single `<h1>`
- `description` becomes the meta/OG description
- `subheadline` is the lead paragraph
- `photo` is the about hero image
- `proseHeadline` titles the prose section

The body is plain markdown. It renders through the `Document` element, which
supplies the typography, so authors never write classes. Add another prose page
by dropping in a new `.mdx` file and a matching route in `src/pages/`.

## Page variants

The upstream kit ships `-02` / `-03` variants of every page and ~38 sections;
only what the `-01` pages needed was ported (YAGNI). To adopt a different
variant, port the corresponding section from the kit into
`src/components/sections/` and swap it into the relevant page — the config feeds
it the same data.

## Deployment, canonical URLs and the sitemap

`site` in `astro.config.mjs` is the deployed origin. It drives canonical tags,
OpenGraph URLs and `@astrojs/sitemap`. **Change it before you deploy** — it is
currently `https://example.com`. Update the `Sitemap:` line in
`public/robots.txt` to match.

Infrastructure and deploy config live in the `citadel` repo, not here.

## Notes

- Interactive bits (mobile nav, FAQ accordion, pricing tabs) use
  `@tailwindplus/elements` web components, registered by a single client script
  in `src/layouts/Layout.astro`. There is no React on this site.
- `@tailwindplus/elements` requires a commercial Tailwind Plus licence.
- Remote images from `assets.tailwindplus.com` are plain `<img>` with explicit
  dimensions. Point them at your own assets when you re-theme.
