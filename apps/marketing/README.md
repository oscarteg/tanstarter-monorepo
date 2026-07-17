# @repo/marketing

The static marketing site: a single-page "Rams Document" home reproduced in
Astro. It builds to plain HTML with no server runtime, and ships `/` (the whole
marketing story, with `#features` / `#faq` / `#pricing` anchors), a minimal
`/privacy`, and a `404`.

```sh
vp run --filter=@repo/marketing dev      # local dev server
vp run --filter=@repo/marketing build    # static build into dist/
vp run --filter=@repo/marketing preview  # serve the built site
```

## Design language

The site shares the **Rams Document** design language with the app (`@repo/ui` /
`apps/web`): warm paper, near-black ink, a single restrained Braun-orange accent,
hairline rules, square corners, Archivo (grotesk) + Space Mono (labels). Light
and dark both work; the theme is applied via `[data-theme]` on `<html>`, set from
the OS colour scheme by a tiny inline script in `src/layouts/Layout.astro`.

Sections are re-authored as `.astro` components under
`src/components/sections/` (Header, Hero, Logos, Features, Stats, Testimonials,
Faq, Pricing, Cta, Footer). Each uses a scoped `<style>` bound to the design
tokens — there is no React and no inline-style objects.

## Re-theming for a new project

Everything you need to change lives in `src/config/` and `src/content/`. You
should not have to touch component markup to launch a new brand.

| What                                          | Where                     |
| --------------------------------------------- | ------------------------- |
| Brand name, nav, footer links, socials        | `src/config/site.ts`      |
| Newsletter copy, fineprint, 404 copy          | `src/config/site.ts`      |
| SEO defaults: title template, description, OG | `src/config/site.ts`      |
| Announcement, hero, logos, features           | `src/config/home.ts`      |
| Stats, testimonials, FAQs                     | `src/config/home.ts`      |
| Pricing tiers                                 | `src/config/home.ts`      |
| Final CTA                                     | `src/config/home.ts`      |
| Privacy prose                                 | `src/content/pages/*.mdx` |

Each config module is typed, so a missing or misspelled field is a build error
rather than a blank section.

The demo copy is deliberately absurd placeholder text about a fake SaaS. Replace
it — the types will tell you when you've covered everything.

### Before you launch

- **Add `public/og.png`** (1200x630). `site.seo.defaultImage` points at it and
  nothing ships one, so social previews 404 until you add it. Point
  `defaultImage` elsewhere if you'd rather.
- **Replace `public/favicon.svg`** — it's a neutral placeholder mark.
- **Replace `public/uploads/*.png`** — the demo product screenshots referenced by
  `home.hero.image` and `home.features[].image`.
- **Set `site` in `astro.config.mjs`** and the `Sitemap:` line in
  `public/robots.txt` to your real origin.

### Colours and fonts

Design tokens live in `src/styles/tokens/{colors,typography,spacing}.css` and are
imported by `src/styles/global.css`. The values are kept identical to
`packages/ui/styles/base.css`, so the marketing site and the app stay visually in
sync — edit both together. Fonts are self-hosted via Fontsource
(`@fontsource-variable/archivo`, `@fontsource/space-mono`); swap the imports in
`global.css` and the `--font-*` tokens to re-typeface.

### Editing prose

`/privacy` renders MDX from `src/content/pages/`. Frontmatter is validated by the
schema in `src/content.config.ts`:

- `title` becomes the page's single `<h1>`
- `description` becomes the meta/OG description
- `subheadline` is the lead line under the title

The body is plain markdown, styled by the scoped `.prose` rules in
`src/pages/privacy.astro`. Add another prose page by dropping in a new `.mdx`
file and a matching route in `src/pages/`.

## Deployment, canonical URLs and the sitemap

`site` in `astro.config.mjs` is the deployed origin. It drives canonical tags,
OpenGraph URLs and `@astrojs/sitemap`. **Change it before you deploy** — it is
currently `https://example.com`. Update the `Sitemap:` line in
`public/robots.txt` to match.

Infrastructure and deploy config live in the `citadel` repo, not here.

## Notes

- The FAQ accordion is native `<details>`/`<summary>` — no JavaScript, fully
  accessible, styled to the Rams look.
- The demo product screenshots are plain `<img>` with explicit dimensions.
  Point them at your own assets when you re-theme.
